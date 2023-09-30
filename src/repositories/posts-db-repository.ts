import {CreateInputData, CreatePostType, PostType} from "../types/types";
import { randomUUID } from "crypto";
import {dbCollectionBlog, dbCollectionPost} from "../db/db";
import { ObjectId } from "mongodb";



export const postsRepository = {
    getAllPosts () {
        return dbCollectionPost.find({}).toArray()
    },

    findPostByID (id: string): Promise<PostType | null> {
        return dbCollectionPost.findOne({_id: new ObjectId(id)})
    },

    async deletePostById (id: string) : Promise<boolean> {
        const result = await dbCollectionPost.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
//todo types with id
    async createPost (inputData: CreateInputData & {blogName: string}): Promise<any> {
        const {title, shortDescription, content, blogName,blogId} = inputData

        const newPost: PostType = {
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt: new Date().toISOString()
        }
        const res = await dbCollectionPost.insertOne({...newPost})

        return {...newPost, _id: res.insertedId}
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