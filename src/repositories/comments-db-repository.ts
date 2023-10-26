import {
    NewCommentDB,
    CommitQuery,
    NewCommentViewType
} from "../types/comments/comments";
import {dbCollectionComments} from "../db/db";
import {ObjectId} from "mongodb";

type Test = {
    [key: string]: any
}

export const commentsDbRepository = {
    async updatedCommentById(commentId: string, content: string) {
        const comment = await dbCollectionComments.findOne({_id: new ObjectId(commentId)})
        if(!comment) {
            return null
        }

        const updateField = {
            $set: {
                content
            }
        }
        const result = await dbCollectionComments.updateOne({_id: new ObjectId(commentId)}, updateField)

        return result.matchedCount === 1
    },

    async deleteCommentById(id: string) {
        const result = await dbCollectionComments.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    },

    async findCommentById(id: string): Promise<NewCommentViewType> {
        // нужна тут проверка на id?
        const comment = await dbCollectionComments.findOne({_id: new ObjectId(id)})

        if(!comment){
            throw new Error('Comment is not exist')
        }

        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt
        }
    },

    async getAllComments(defaultResult: CommitQuery, postId?: string){
        const {pageNumber, pageSize, sortBy, sortDirection} = defaultResult
        const skip = (pageNumber -1) * pageSize
        const sort: Test = {}
        sort[sortBy] = sortDirection === 'asc' ? 1 : -1

        const comments = await dbCollectionComments
            .find(postId? {postId:postId} : {})
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .toArray()

        const totalCount = await dbCollectionComments.countDocuments(postId? {postId:postId} : {})
        const pageCount = Math.ceil(totalCount/ pageSize)

        return {
            pageCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: comments.map(comment => ({
                id: comment._id.toString(),
                content: comment.content,
                commentatorInfo: {
                    userId: comment.commentatorInfo.userId ,
                    userLogin: comment.commentatorInfo.userLogin,
                },
            createdAt: comment.createdAt
            }))
        }
    },

    async createComment(newComment: NewCommentDB): Promise<string> {
        const result = await dbCollectionComments.insertOne(newComment)

        return result.insertedId.toString()

        // return {
        //     id: result.insertedId.toString(),
        //     content: newComment.content,
        //     commentatorInfo: {
        //         userId: user.id.toString(),
        //         userLogin: user.login,
        //     },
        //     createdAt: newComment.createdAt
        // }
    },

    async deleteAllComments(){
        const result =  await dbCollectionComments.deleteMany({})

        return result.deletedCount > 0
    }
}