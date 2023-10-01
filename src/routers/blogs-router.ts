import {Request, Response, Router} from "express"
import {RequestWithParams, RequestWithBody} from "../types/requests"
import {HTTP_STATUSES} from "../types/statutes"
import {blogsRepository} from "../repositories/blogs-db-repository"
import {authGuardMiddleware} from "../middleware/authGuardMiddleware"
import {ValidateBlog} from "../middleware/blog/blog-validation-middleware";
import {ErrorsValidation} from "../middleware/errorsValidation";
import {ObjectId} from "mongodb";

export const blogsRouter = Router({})

blogsRouter.get(
    '/',
    async (req: Request, res: Response) => {
    const allBlogs = await blogsRepository.getAllBlogs()
    res.status(HTTP_STATUSES.ok_200).send(allBlogs)
})

blogsRouter.get(
    '/:id',
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const isIdValid = ObjectId.isValid(req.params.id)
        if (!isIdValid) {
            res.sendStatus(HTTP_STATUSES.not_found_404)
            return
        }
    const blogByID = await blogsRepository.findBlogById(req.params.id)
    if(!blogByID) {
        res.sendStatus(HTTP_STATUSES.not_found_404)
        return
    }
    res.status(HTTP_STATUSES.ok_200).send(blogByID)
})

blogsRouter.delete(
    '/:id',
    authGuardMiddleware,
    async (req:RequestWithParams<{ id:string }>, res:Response) =>{

    const id = req.params.id

    const blogIsDeleted = await blogsRepository.deleteBlogById(id)

    if(!blogIsDeleted) {
        res.status(HTTP_STATUSES.not_found_404).send('Not Found')
        return
    }

    res.status(HTTP_STATUSES.no_content_204).send('No content')
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

    const newCreatedBlog = await blogsRepository.createBlog(req.body)
    return res.status(HTTP_STATUSES.created_201).send(newCreatedBlog)
})

blogsRouter.put(
    '/:id',
    authGuardMiddleware,
    ValidateBlog(),
    ErrorsValidation,
    (req: RequestWithParams<{
        id:string
    }>
        & RequestWithBody<{
        name: string,
        description: string,
        websiteUrl: "https://DVRQ.16BihhBPyLWyxzJ1FYlwvXwIzP5vWKoBXgsHD8U6T0MxOfFITrUTaKXoxwKAbvaJUWEqy2tqA4w1Zm5uwoV8UGn"
    }>,
    res: Response) =>{

    const id = req.params.id
    let {name, description, websiteUrl} = req.body

    const updatedBlog = blogsRepository.updateBlogById(id, name, description, websiteUrl)

    if(!updatedBlog) {
        res.status(HTTP_STATUSES.not_found_404).send('Not found')
        return
    }

    return res.status(HTTP_STATUSES.no_content_204).send('No Content')
})