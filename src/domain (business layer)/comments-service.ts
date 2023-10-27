import {commentsDbRepository} from "../repositories/comments-db-repository";
import {usersRepository} from "../repositories/users-db-repository";
import {
    CommitQuery,
    NewCommentDB,
    NewCommentInput,
    NewCommentViewType
} from "../types/comments/comments";
import {ObjectId} from "mongodb";


export const commentsService = {

    async updatedCommentById(commentId: string, content: string){
        return await commentsDbRepository.updatedCommentById(commentId, content)
    },

    async deleteCommentById(commentId: string){
        return await commentsDbRepository.deleteCommentById(commentId)
    },

    async findCommentById(id: string) {
        return await commentsDbRepository.findCommentById(id)
    },

    async getAllComments(defaultResult: CommitQuery, postId: string) {
        return await commentsDbRepository.getAllComments(defaultResult, postId)
    },

    async createComment(inputData: NewCommentInput): Promise<NewCommentViewType> {
        const { content, userId, postId} = inputData

        const user = await usersRepository.findUserById(userId)
        if(!user){
            throw new Error('User is not exist')
        }

        const newComment: NewCommentDB = {
            postId,
            content,
            commentatorInfo: {
                userId: user._id.toString(),
                userLogin: user.login
            },
            createdAt: new Date().toISOString()
        }

        const id = await commentsDbRepository.createComment(newComment)

        return {
            id,
            content: newComment.content,
            commentatorInfo: newComment.commentatorInfo,
            createdAt: newComment.createdAt
        }
    },

    async deleteAllComments() {
        return await commentsDbRepository.deleteAllComments()
    }
}
