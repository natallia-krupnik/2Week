import {CreateInputData, CreatePostType, PostDBType, PostViewType} from "../types/types";
import { randomUUID } from "crypto";
import {dbCollectionBlog, dbCollectionPost} from "../db/db";
import { ObjectId } from "mongodb";



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
                createdAt: new Date().toISOString().split('.')[0]
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

    async createPost (inputData: CreateInputData & {blogName: string}): Promise<any> {
        const {title, shortDescription, content, blogName,blogId} = inputData

        const newPost: PostDBType = {
            _id: new ObjectId(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt: new Date().toISOString().split('.')[0]
        }
        await dbCollectionPost.insertOne((newPost))

        return {
            id: newPost._id.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: new Date().toISOString().split('.')[0]
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
                createdAt: new Date().toISOString().split('.')[0]
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