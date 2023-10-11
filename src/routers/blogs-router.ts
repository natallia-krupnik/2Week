import {Request, Response, Router} from "express"
import {RequestWithParams, RequestWithBody} from "../types/requests"
import {HTTP_STATUSES} from "../types/statutes"
import {authGuardMiddleware} from "../middleware/authGuardMiddleware"
import {ValidateBlog} from "../middleware/blog/blog-validation-middleware";
import {ErrorsValidation} from "../middleware/errorsValidation";
import {blogsService} from "../domain (business layer)/blogs-service";
import {QueryParamsBlogsInput, QueryTypeView, QueryTypeViewBlogs} from "../types/types";
import {postsService} from "../domain (business layer)/posts-service";
import {sortQueryParams, sortQueryParamsBlogs} from "./helpers/helpers-posts-blogs";
import {ValidatePostWithoutBlogId} from "../middleware/post/post-validation-middleware";
import {blogsRepository} from "../repositories/blogs-db-repository";

export const blogsRouter = Router({})

blogsRouter.get(
    '/',
    async (req: RequestWithParams<QueryParamsBlogsInput>, res: Response) => {

    const defaultResult: QueryTypeViewBlogs = sortQueryParamsBlogs(req.query)
    const allBlogs = await blogsService.getAllBlogs(defaultResult)

    res.status(HTTP_STATUSES.ok_200).send(allBlogs)
})

blogsRouter.post(
    '/',
    authGuardMiddleware,
    ValidateBlog(),
    ErrorsValidation,
    async (req: RequestWithBody<{
        name: string,
        description: string,
        websiteUrl: string
    }>, res: Response) =>{

        const newCreatedBlog = await blogsService.createBlog(req.body)

        return res.status(HTTP_STATUSES.created_201).send(newCreatedBlog)
    })

blogsRouter.get(
    '/:blogId/posts',
    async (
        req: RequestWithParams<{
            pageNumber: string,
            pageSize: string,
            sortBy: string,
            sortDirection: string,
            blogId: string
        }>, res: Response) => {

        //где должна быть эта проверка. Тут или в service
        const blogById = await blogsService.findBlogById(req.params.blogId)
        if(!blogById) {
            res.sendStatus(HTTP_STATUSES.not_found_404)
            return
        }

        const defaultResult: QueryTypeView = sortQueryParams(req.query)

        const allPostsForBlog = await postsService.getAllPosts(defaultResult)

        return res.status(HTTP_STATUSES.ok_200).send(allPostsForBlog)
    })

// create Post for Blog with ID
blogsRouter.post(
    '/:blogId/posts',
    authGuardMiddleware,
    ValidatePostWithoutBlogId(),
    ErrorsValidation,
    async (req: RequestWithParams<{ blogId: string }>
        & RequestWithBody<{
        title: string,
        shortDescription: string,
        content: string
    }>, res: Response) =>{

        //где должна быть эта проверка. Тут или в service
        const blogById = await  blogsService.findBlogById(req.params.blogId);
        if(blogById) {
            res.sendStatus(HTTP_STATUSES.not_found_404)
            return
        }
        const newCreatedPost = await postsService.createPost({...req.body, ...req.params})
        return res.status(HTTP_STATUSES.created_201).send(newCreatedPost)
    })

blogsRouter.get(
    '/:id',
    async (req: RequestWithParams<{ id: string }>, res: Response) => {

    //где должна быть эта проверка. Тут или в service
    const blogByID = await blogsService.findBlogById(req.params.id)
    if(!blogByID) {
        res.status(HTTP_STATUSES.not_found_404).send('Not found')
        return
    }
    res.status(HTTP_STATUSES.ok_200).send(blogByID)
})

blogsRouter.put(
    '/:id',
    authGuardMiddleware,
    ValidateBlog(),
    ErrorsValidation,
    async (req: RequestWithParams<{
        id:string
    }>
        & RequestWithBody<{
        name: string,
        description: string,
        websiteUrl: string
    }>,
    res: Response) =>{

    const id = req.params.id
    let {name, description, websiteUrl} = req.body

    const updatedBlog = await blogsService.updateBlogById(id, name, description, websiteUrl)

    if(!updatedBlog) {
        res.status(HTTP_STATUSES.not_found_404).send('Not found')
        return
    }

    return res.status(HTTP_STATUSES.no_content_204).send('No Content')
})

blogsRouter.delete(
    '/:id',
    authGuardMiddleware,
    async (req:RequestWithParams<{ id:string }>, res:Response) =>{
        const id = req.params.id

        const blog = await blogsService.findBlogById(id)

        if( !blog ) return res.status(HTTP_STATUSES.not_found_404).send()
        const blogIsDeleted = await blogsService.deleteBlogById(id)

        if(!blogIsDeleted) {
            res.sendStatus(HTTP_STATUSES.not_found_404)
            return
        }

        return res.status(HTTP_STATUSES.no_content_204).send('No content')
    })