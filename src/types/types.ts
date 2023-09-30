import {ObjectId} from "mongodb";

export type PostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type CreatePostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type BlogType = {
    id: string,
    _id?: ObjectId,
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type CreateBlogType = Omit<BlogType, 'id'>

export type CreateInputData = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}