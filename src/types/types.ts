import {WithId} from "mongodb";
//Auth

export type AuthInputType = {
    loginOrEmail: string,
    password: string,
}
//TYPE for users
export type QueryTypeViewUsers = {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
    sortBy: string;
    sortDirection: string;
    pageSize: number;
    pageNumber: number;
}

export type NewUserType = {
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: string
}
export interface  ExtendsQueryParamsInput extends QueryParamsInput {
    searchLoginTerm?: string,
    searchEmailTerm?: string,
}

export type UserInputType = {
    login: string,
    password: string,
    email: string
}

export type UserViewType = {
    id: string,
    login: string,
    email: string,
    createdAt:string
}
//TYPE FOR POSTS

//GET
export interface QueryParamsInput {
    pageNumber?: string,
    pageSize?: string,
    sortBy?: string,
    sortDirection?: string
}
export type QueryType = {
    sortBy: string;
    sortDirection: string;
    pageSize: number;
    pageNumber: number;
}

//POST
export type CreateInputData = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}
export type PostViewType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}


//TYPE FOR BLOGS

//GET
export interface QueryParamsBlogsInput {
    searchNameTerm?: string,
    sortBy?: string,
    sortDirection?: string,
    pageNumber?: string,
    pageSize?: string
}
export type QueryTypeViewBlogs = {
    searchNameTerm: string | null;
    sortBy: string;
    sortDirection: string;
    pageSize: number;
    pageNumber: number;
}


// The END






export type PostDBType = WithId<PostType>

// export interface PostType  {
//     title: string,
//     shortDescription: string,
//     content: string,
//     blogId: string,
//     blogName: string,
//     createdAt: string
// }
// interface ExtendsType extends PostType{
//     id: string,
// }

type NewType = PostType & { id: string}

export type PostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
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