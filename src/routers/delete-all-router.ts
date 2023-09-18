import {authGuardMiddleware} from "../middleware/authGuardMiddleware";
import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../types/statutes";
import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";

export const deleteAllRouter = Router({})

deleteAllRouter.delete(
    '/',

    (req: Request, res:Response) =>{
        postsRepository.deleteAllPosts()
        blogsRepository.deleteAllBlogs()
        return res.sendStatus(HTTP_STATUSES.no_content_204)
    })
