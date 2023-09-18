import {Request, Response, Router} from "express"
import {RequestWithParams, RequestWithBody} from "../types/requests"
// import {ErrorType} from "../types/errors"
import {HTTP_STATUSES} from "../types/statutes"
import {blogsRepository, BlogType} from "../repositories/blogs-repository"
import {authGuardMiddleware} from "../middleware/authGuardMiddleware"
import {errorsBlogValidation, validateBlog} from "../middleware/blog/blog-validation-middleware";

export const blogsRouter = Router({})

blogsRouter.get(
    '/',
    (req: Request, res: Response) => {
    const allBlogs = blogsRepository.getAllBlogs()
    res.status(HTTP_STATUSES.ok_200).send(allBlogs)
})

blogsRouter.get(
    '/:id',

    (req: RequestWithParams<{ id: string }>, res: Response) => {
    const id = req.params.id
    const blogByID = blogsRepository.findBlogById(id)
    if(!blogByID) {
        res.sendStatus(HTTP_STATUSES.not_found_404)
        return
    }
    res.status(HTTP_STATUSES.ok_200).send(blogByID)
})

blogsRouter.delete(
    '/:id',
    authGuardMiddleware,
    (req:RequestWithParams<{ id:string }>, res:Response) =>{

    const id = req.params.id

    const blogIsDeleted = blogsRepository.deleteBlogById(id)

    if(!blogIsDeleted) {
        res.status(HTTP_STATUSES.unauthorized_401).send('Not Found')
        return
    }

    res.status(HTTP_STATUSES.no_content_204).send('No content')
})

blogsRouter.post(
    '/',
    authGuardMiddleware,
    validateBlog(),
    errorsBlogValidation,
    (req: RequestWithBody<{
        name: string,
        description: string,
        websiteUrl: string
}>, res: Response) =>{

    let { name, description, websiteUrl } = req.body

    const newBlog: BlogType = {
        id: (Math.random()).toString(),
        name,
        description,
        websiteUrl,
    }
    const newCreatedBlog = blogsRepository.createBlog(newBlog)
    return res.status(HTTP_STATUSES.created_201).send(newCreatedBlog)
})

blogsRouter.put(
    '/:id',
    authGuardMiddleware,
    validateBlog(),
    errorsBlogValidation,
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

    res.status(HTTP_STATUSES.no_content_204).send('No Content')
})