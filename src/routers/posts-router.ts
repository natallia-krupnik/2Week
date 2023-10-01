import {Response, Request, Router} from "express";
import {RequestWithBody, RequestWithParams} from "../types/requests";
import {HTTP_STATUSES} from "../types/statutes";
import {postsRepository} from "../repositories/posts-db-repository";
import {authGuardMiddleware} from "../middleware/authGuardMiddleware";
import {ValidatePost} from "../middleware/post/post-validation-middleware";
import {ErrorsValidation} from "../middleware/errorsValidation";
import {blogsRepository} from "../repositories/blogs-db-repository";
import {CreateInputData} from "../types/types";

export const postsRouter = Router({})

postsRouter.get(
    '/',
    async (req: Request, res: Response) =>{
    const allPosts = await postsRepository.getAllPosts()

    res.status(HTTP_STATUSES.ok_200).send(allPosts)
})

postsRouter.get(
    '/:id',
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const id = req.params.id
        const post = await postsRepository.findPostByID(id)

    if(!post) {
        res.status(HTTP_STATUSES.not_found_404).send('Not found')
        return
    }

    res.send(post)
})

postsRouter.delete(
    '/:id',
    authGuardMiddleware,
    async (req:Request<{id:string}>, res: Response) =>{
        const id = req.params.id
        const deletedPostById = await postsRepository.deletePostById(id)

        if(!deletedPostById) {
            res.status(HTTP_STATUSES.not_found_404).send('Not found')
            return
        }

        res.status(HTTP_STATUSES.no_content_204).send('No content')
})

postsRouter.post(
    '/',
    authGuardMiddleware,
    ValidatePost(),
    ErrorsValidation,
    async (req: RequestWithBody<CreateInputData>, res: Response) => {
        const blog = await blogsRepository.findBlogById(req.body.blogId);
        if(!blog) return res.sendStatus(HTTP_STATUSES.not_found_404)

        const newCreatedPost = await postsRepository.createPost({...req.body, blogName: blog.name})
        return res.status(HTTP_STATUSES.created_201).send(newCreatedPost)
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
    }>, res: Response) => {

        const blog = await blogsRepository.findBlogById(req.body.blogId)
        if (!blog) return res.sendStatus(HTTP_STATUSES.not_found_404)

        const id = req.params.id
        let { title, shortDescription, content, blogId} = req.body

        const updatePost = await postsRepository.updatePostById(id, title, shortDescription, content, blogId)

        if(!updatePost) {
            res.status(HTTP_STATUSES.not_found_404).send('No found')
            return
        }

        return res.status(HTTP_STATUSES.no_content_204).send('No content')
})