import {ObjectId} from "mongodb";


export type NewCommentInput = {
    userId: string,
    content: string
}

export type CommitViewInput = {
    postId: string,
}

export type CommitViewQueryParams = {
    pageNumber?: string,
    pageSize?: string,
    sortBy?: string,
    sortDirection?: string
}
export type CommitQuery = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string
}

export type NewCommentDB = {
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}

export type NewCommentViewType = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}