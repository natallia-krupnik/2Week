import {ObjectId, WithId} from "mongodb";

export type PostViewType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}
export type PostDBType = WithId<PostType>

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

export type BlogViewType = {
    id: string,
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type BlogDBType = WithId<BlogType>

export type BlogType =   {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
//export type CreateBlogType = Omit<BlogType, 'id'>

export type CreateInputData = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}