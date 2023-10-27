import { Response, Request, Router} from "express"
import {RequestWithParams, RequestWithBody} from "../types/requests"
import {BearerAuthMiddleware} from "../middleware/bearerAuthMiddleware";
import {commentsService} from "../domain (business layer)/comments-service";
import {HTTP_STATUSES} from "../types/statutes";
import {NewCommentInput} from "../types/comments/comments";
import {CommentValidation} from "../middleware/comment/comment-validation";
import {postsService} from "../domain (business layer)/posts-service";

export const commentsRouter = Router({})

// update existing comment by id with InputModel
commentsRouter.put(
    '/:id',
    BearerAuthMiddleware,
    CommentValidation(), // почему вызываю, как функцию
    async (
        req: RequestWithParams<{ id:string}>
            & RequestWithBody<NewCommentInput>,

            res: Response) => {

        const userId = req.user.id
        const comment = await commentsService.findCommentById(req.params.id)

        if(comment){
            if(comment.commentatorInfo.userId !== userId) {
                res.sendStatus(HTTP_STATUSES.forbidden_403)
                return
            }
        }

        const commentId = req.params.id
        let { content } = req.body

        const updatedComment = await commentsService.updatedCommentById(commentId, content)
        if(!updatedComment) {
            res.status(HTTP_STATUSES.not_found_404).send('Not found')
            return
        }

        return res.status(HTTP_STATUSES.no_content_204).send('Not content')
    }
)

// delete comment specified by id
commentsRouter.delete(
    '/:id',
    BearerAuthMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const id  = req.params.id

        const userId = req.user.id
        const comment = await commentsService.findCommentById(id)

        if(!comment) {
            res.sendStatus(HTTP_STATUSES.not_found_404)
            return
        }

        if(comment) {
            if(comment.commentatorInfo.userId !== userId){
                res.sendStatus(HTTP_STATUSES.forbidden_403)
                return
            }
        }

        const commentIsDeleted = await commentsService.deleteCommentById(id)

        if(!commentIsDeleted) {
            res.sendStatus(HTTP_STATUSES.not_found_404)
            return
        }

        return res.sendStatus(HTTP_STATUSES.no_content_204)
    }
)

// return comment by id
commentsRouter.get(
    '/:id',
    async (req: RequestWithParams<{ id: string }>, res: Response) => {

        const commentById = await commentsService.findCommentById(req.params.id)
        if(!commentById) {
            res.status(HTTP_STATUSES.not_found_404)
            return  // почему тут return
        }
        res.status(HTTP_STATUSES.ok_200).send(commentById)
    }
)
