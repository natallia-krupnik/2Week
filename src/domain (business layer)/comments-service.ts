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

    async deleteCommentById(id: string){
        return await commentsDbRepository.deleteCommentById(id)
    },

    async findCommentById(id: string) {
        return await commentsDbRepository.findCommentById(id)
    },

    async getAllComments(defaultResult: CommitQuery, postId: string) {
        return await commentsDbRepository.getAllComments(defaultResult, postId)
    },

    async createComment(inputData: NewCommentInput): Promise<NewCommentViewType> {
        const { content, userId} = inputData

        const user = await usersRepository.findUserById(userId)
        if(!user){
            throw new Error('User is not exist')
        }

        const newComment: NewCommentDB = {
            content,
            commentatorInfo: {
                userId: user._id.toString(),
                userLogin: user.login
            },
            createdAt: new Date().toISOString()
        }

        // const newCommentId = await  commentsDbRepository.createComment(newComment)
        //
        // return {...newComment, id:newCommentId}
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
