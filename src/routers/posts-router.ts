import {Response, Request, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/requests";
import {HTTP_STATUSES} from "../types/statutes";
import {BaseAuthMiddleware} from "../middleware/baseAuthMiddleware";
import {ValidatePost} from "../middleware/post/post-validation-middleware";
import {ErrorsValidation} from "../middleware/errorsValidation";
import {CreateInputData, PostViewType, QueryParamsInput, QueryType} from "../types/types";
import { postsService } from "../domain (business layer)/posts-service";
import {blogsService} from "../domain (business layer)/blogs-service";
import {sortQueryParams} from "./helpers/helpers-posts-blogs";
import {commentsService} from "../domain (business layer)/comments-service";
import {CommitQuery, CommitViewInput, CommitViewQueryParams} from "../types/comments/comments";
import {BearerAuthMiddleware} from "../middleware/bearerAuthMiddleware";
import {CommentValidation} from "../middleware/comment/comment-validation";
import {sortQueryParamsComments} from "./helpers/helpers-comments";

export const postsRouter = Router({})

// return comments for specified post
postsRouter.get(
    '/:postId/comments',
    async (
        req: RequestWithParams<CommitViewInput> & RequestWithQuery<CommitViewQueryParams>,
        res: Response) => {

        const postId = await postsService.findPostByID(req.params.postId)
        if(!postId){
            return res.sendStatus(HTTP_STATUSES.not_found_404)
        }

        const defaultResult: CommitQuery = sortQueryParamsComments(req.query)

        const allCommentsForPost = await commentsService.getAllComments(defaultResult, req.params.postId)

        return res.status(HTTP_STATUSES.ok_200).send(allCommentsForPost)
    }
)

// create new commit for specified Post(id)
postsRouter.post(
    '/:postId/comments',
    BearerAuthMiddleware,
    CommentValidation(),
    ErrorsValidation,
    async (
        req: RequestWithParams<{postId: string}>
            & RequestWithBody<{content: string}>,
        res: Response
    ) => {

        const postId = await postsService.findPostByID(req.params.postId)
        if(!postId) {
            return res.sendStatus(HTTP_STATUSES.not_found_404)
        }
        const userId = req.user.id

        const newCreatedComment = await commentsService.createComment({...req.body, userId})

        return res.status(HTTP_STATUSES.created_201).send(newCreatedComment)
    }
)

// return all posts
postsRouter.get(
    '/',
    async (req: RequestWithParams<QueryParamsInput>, res: Response) =>{

        const defaultResult: QueryType = sortQueryParams(req.query)
        const allPosts = await postsService.getAllPosts(defaultResult)

        res.status(HTTP_STATUSES.ok_200).send(allPosts)
})

// create new post
postsRouter.post(
    '/',
    BaseAuthMiddleware,
    ValidatePost(),
    ErrorsValidation,
    async (req: RequestWithBody<CreateInputData>, res: Response<PostViewType>) => {
        const newCreatedPost = await postsService.createPost({...req.body})
        return res.status(HTTP_STATUSES.created_201).send(newCreatedPost)
    })

// return post by id
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

// update existing post by id with InputModel
postsRouter.put(
    '/:id',
    BaseAuthMiddleware,
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

// delete post specified by id
postsRouter.delete(
    '/:id',
    BaseAuthMiddleware,
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