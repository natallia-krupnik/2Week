import {Response, Request, Router} from "express";
import {RequestWithBody, RequestWithParams} from "../types/requests";
import {HTTP_STATUSES} from "../types/statutes";
import {authGuardMiddleware} from "../middleware/authGuardMiddleware";
import {ValidatePost} from "../middleware/post/post-validation-middleware";
import {ErrorsValidation} from "../middleware/errorsValidation";
import {CreateInputData, PostViewType, QueryParamsInput, QueryTypeView} from "../types/types";
import { postsService } from "../domain (business layer)/posts-service";
import {blogsService} from "../domain (business layer)/blogs-service";
import {sortQueryParams} from "./helpers/helpers-posts-blogs";

export const postsRouter = Router({})

postsRouter.get(
    '/',
    async (req: RequestWithParams<QueryParamsInput>, res: Response) =>{

        const defaultResult: QueryTypeView = sortQueryParams(req.query)
        const allPosts = await postsService.getAllPosts(defaultResult)

        res.status(HTTP_STATUSES.ok_200).send(allPosts)
})


postsRouter.post(
    '/',
    authGuardMiddleware,
    ValidatePost(),
    ErrorsValidation,
    async (req: RequestWithBody<CreateInputData>, res: Response<PostViewType>) => {
        const newCreatedPost = await postsService.createPost({...req.body})
        return res.status(HTTP_STATUSES.created_201).send(newCreatedPost)
    })


postsRouter.get(
    '/:id',
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const id = req.params.id
        const post = await postsService.findPostByID(id)

    if(!post) {
        res.status(HTTP_STATUSES.not_found_404).send('Not found')
        return
    }

    res.status(200).send(post)
})


postsRouter.put(
    '/:id',
    authGuardMiddleware,
    ValidatePost(),
    ErrorsValidation,
    async (req: RequestWithParams<{
        id: string
    }>
        & RequestWithBody<{
        title: string,
        shortDescription: string,
        content: string,
        blogId: string
    }>, res: Response) => { // какой тут Promise??

        const blog = await blogsService.findBlogById(req.body.blogId)
        if (!blog) return res.sendStatus(HTTP_STATUSES.not_found_404)

        const id = req.params.id
        let { title, shortDescription, content, blogId} = req.body

        const updatePost = await postsService.updatePostById(id, title, shortDescription, content, blogId)

        if(!updatePost) {
            res.status(HTTP_STATUSES.not_found_404).send('No found')
            return
        }

        return res.status(HTTP_STATUSES.no_content_204).send('No content')
})

postsRouter.delete(
    '/:id',
    authGuardMiddleware,
    async (req:Request<{id:string}>, res: Response) => {
        const id = req.params.id

        const post = await postsService.findPostByID(id)
        if (!post) return res.sendStatus(404)

        const deletedPostById = await postsService.deletePostById(id)

        if(!deletedPostById) {
            res.status(HTTP_STATUSES.not_found_404).send('Not found')
            return
        }

        return res.status(HTTP_STATUSES.no_content_204).send('No content')
    })