import {CreateInputData, CreatePostType, PostType, PostTypeWithId} from "../types/types";
import { randomUUID } from "crypto";
import {dbCollectionBlog, dbCollectionPost} from "../db/db";
import { ObjectId } from "mongodb";



export const postsRepository = {
    async getAllPosts () {
        const posts = await dbCollectionPost.find({}).toArray()
        return posts.map((post) => {
            return  {...post, id: post._id.toString()}
        })
    },

    async findPostByID (id: string): Promise<PostType | null> {
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

        const newPost: PostTypeWithId = {
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt: new Date().toISOString()
        }
        const res = await dbCollectionPost.insertOne({...newPost})

        return {...newPost, id: res.insertedId.toString()}
    },

    async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const updateField = {
            $set: {
                title,
                shortDescription,
                content,
                blogId
            }
        }
        const result = await dbCollectionPost.updateOne({ _id: new ObjectId(id) }, updateField)

        return result.matchedCount > 0
    },

    async deleteAllPosts () {
        const result = await dbCollectionPost.deleteMany()
        return result.deletedCount > 0
    }
}