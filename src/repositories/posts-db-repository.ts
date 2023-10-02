import {CreateInputData, CreatePostType, PostDBType, PostType, PostViewType} from "../types/types";
import { randomUUID } from "crypto";
import {dbCollectionBlog, dbCollectionPost} from "../db/db";
import { ObjectId } from "mongodb";
import {blogsRepository} from "./blogs-db-repository";



export const postsRepository = {
    async getAllPosts () {
        const posts = await dbCollectionPost.find({}).toArray()
        return posts.map((post) => {
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
            }
        })
    },

    async findPostByID (id: string): Promise<PostViewType | null> {
        const post = await dbCollectionPost.findOne({_id: new ObjectId(id)})

        if(post) {
            const {_id, ...rest} = post
            return {...rest, id: post._id.toString()}
        }
        return null
    },

    async deletePostById (id: string) : Promise<boolean> {
        const result = await dbCollectionPost.deleteOne({_id: new ObjectId(id)})

        if (result.deletedCount === 0) {
            return false
        }
        return true    },

    async createPost (inputData: CreateInputData): Promise<any> {
        const {title, shortDescription, content,blogId} = inputData

        const blog = await  blogsRepository.findBlogById(blogId);

        const newPost: PostType = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString()
        }
        const res = await dbCollectionPost.insertOne((newPost))

        return {
            id: res.insertedId.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt
        }
    },

    async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const post = await dbCollectionPost.findOne({_id: new ObjectId(id)})

        if(!post) {
            return null
        }
        const updateField = {
            $set: {
                title,
                shortDescription,
                content,
                blogId,
            }
        }
        const result = await dbCollectionPost.updateOne({ _id: new ObjectId(id) }, updateField)

        return result.matchedCount === 1
    },

    async deleteAllPosts () {
        const result = await dbCollectionPost.deleteMany()
        return result.deletedCount > 0
    }
}