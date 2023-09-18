import {Response, Request, Router} from "express";
import {RequestWithBody, RequestWithParams} from "../types/requests";
import {HTTP_STATUSES} from "../types/statutes";
import {postsRepository} from "../repositories/posts-repository";
import {authGuardMiddleware} from "../middleware/authGuardMiddleware";
import {ErrorType} from "../types/errors";
import {errorsPostValidation, validatePost} from "../middleware/post/post-validation-middleware";

export const postsRouter = Router({})

postsRouter.get(
    '/',
    (req: Request, res: Response) =>{
    const allPosts = postsRepository.getAllPosts()
    res.status(HTTP_STATUSES.ok_200).send(allPosts)
})

postsRouter.get(
    '/:id',
    (req: RequestWithParams<{ id: string }>, res: Response) => {
    const id = req.params.id
    const post = postsRepository.findPostByID(id)
    if(!post) {
        res.status(HTTP_STATUSES.not_found_404).send('Not found')
        return
    }
    res.send(post)
})

postsRouter.delete(
    '/:id',
    authGuardMiddleware,
    (req:Request<{id:string}>, res: Response) =>{
        const id = req.params.id
        const deletedPostById = postsRepository.deletePostById(id)
        if(!deletedPostById) {
            res.status(HTTP_STATUSES.not_found_404).send('Not found')
            return
        }
        res.status(HTTP_STATUSES.no_content_204).send('No content')
})

postsRouter.delete(
    '/testing/all-data',
    authGuardMiddleware,
    (req:Request, res: Response) =>{
        const deleteAllPosts = postsRepository.deleteAll()
        if(deleteAllPosts) {
            res.status(HTTP_STATUSES.no_content_204).send('All data is deleted')
        }
})

postsRouter.post(
    '/',
    authGuardMiddleware,
    validatePost,
    errorsPostValidation,
    (req:RequestWithBody<{
        title: string,
        shortDescription: string,
        content: string,
        blogId: string
    }>, res:Response)=> {
        let errors: ErrorType = {
            errorsMessages: []
        }

        let { title, shortDescription, content, blogId} = req.body

        const newPost = {
            id: (Math.random()).toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: 'This ist mein Blog'
        }
        const newCreatedPost = postsRepository.createPost(newPost)
        res.status(HTTP_STATUSES.created_201).send(newCreatedPost)
})

postsRouter.put(
    '/id',
    authGuardMiddleware,
    validatePost,
    errorsPostValidation,
    (req: RequestWithParams<{
        id: string
    }>
        & RequestWithBody<{
        title: string,
        shortDescription: string,
        content: string,
        blogId: string
    }>, res: Response) => {
        let errors: ErrorType = {
            errorsMessages: []
        }

        const id = req.params.id
        let { title, shortDescription, content, blogId} = req.body

        const updatePost = postsRepository.updatePostById(id, title, shortDescription, content, blogId)

        if(!updatePost) {
            res.status(HTTP_STATUSES.not_found_404).send('No found')
            return
        }
        res.status(HTTP_STATUSES.no_content_204).send('No content')
})