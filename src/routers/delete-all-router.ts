import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../types/statutes";
import {postsService} from "../domain (business layer)/posts-service";
import {blogsService} from "../domain (business layer)/blogs-service";

export const deleteAllRouter = Router({})

deleteAllRouter.delete(
    '/',

    async (req: Request, res:Response) =>{
        await postsService.deleteAllPosts()
        await blogsService.deleteAllBlogs()
        return res.sendStatus(HTTP_STATUSES.no_content_204)
    })
