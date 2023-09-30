import {BlogType} from "../types/types";
import {ObjectId} from "mongodb";
import {dbCollectionBlog} from "../db/db";

export const blogsRepository = {
    getAllBlogs () {
        return dbCollectionBlog.find({}).toArray()
    },

    findBlogById (id: string): Promise<BlogType | null> {
        return dbCollectionBlog.findOne({_id: new ObjectId(id)})
    },

    async deleteBlogById (id: string) {
        const result = await dbCollectionBlog.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async createBlog(inputData: { name: string; description: string; websiteUrl: string }) {
        let { name, description, websiteUrl } = inputData

        const newBlog: BlogType = {
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const insertedNewBlog = await dbCollectionBlog.insertOne(newBlog)
        //console.log(insertedNewBlog)
        return {...newBlog, _id: insertedNewBlog.insertedId.toString()}
    },

    async updateBlogById(id: string, name: string, description: string, websiteUrl: string) {
        const blog = await dbCollectionBlog.findOne({_id: new ObjectId(id)})

        if (!blog) {
            return null
        }
        const updateField = {
            $set: {
                name,
                description,
                websiteUrl
            }
        }

        const result = await dbCollectionBlog.updateOne({ id: id }, updateField)

        return result.matchedCount === 1
    },

    async deleteAllBlogs() {
        const resul = await dbCollectionBlog.deleteMany({})

        return resul.deletedCount > 0
    }
}