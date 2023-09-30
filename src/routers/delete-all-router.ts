import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../types/statutes";
import {postsRepository} from "../repositories/posts-db-repository";
import {blogsRepository} from "../repositories/blogs-db-repository";

export const deleteAllRouter = Router({})

deleteAllRouter.delete(
    '/',

    async (req: Request, res:Response) =>{
        await postsRepository.deleteAllPosts()
        await blogsRepository.deleteAllBlogs()
        return res.sendStatus(HTTP_STATUSES.no_content_204)
    })
