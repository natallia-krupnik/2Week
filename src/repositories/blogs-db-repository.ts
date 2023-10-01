import {BlogType} from "../types/types";
import {ObjectId} from "mongodb";
import {dbCollectionBlog} from "../db/db";

export const blogsRepository = {
    async getAllBlogs () {
        const blogs = await dbCollectionBlog.find({}, {projection: {_id: 0}}).toArray()
        // const blogs = await dbCollectionBlog.find({}).toArray()
        return blogs.map((blog) => {
            return {...blog, id: blog._id.toString()}
        })
    },

    async findBlogById (id: string): Promise<BlogType | null> {
        const blogId = await dbCollectionBlog.findOne({_id: new ObjectId(id)})
        if(blogId) {
            return {...blogId, id: blogId._id.toString()}
        }
        return null
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
        const { insertedId } = await dbCollectionBlog.insertOne(newBlog)
        //console.log(insertedNewBlog)
        return {...newBlog, id: insertedId.toString()}
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

        const result = await dbCollectionBlog.updateOne({ _id: new ObjectId(id) }, updateField)

        return result.matchedCount === 1
    },

    async deleteAllBlogs() {
        const resul = await dbCollectionBlog.deleteMany({})

        return resul.deletedCount > 0
    }
}