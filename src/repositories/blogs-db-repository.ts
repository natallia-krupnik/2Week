import {BlogType} from "../types/types";
import {ObjectId} from "mongodb";
import {dbCollectionBlog} from "../db/db";

export const blogsRepository = {
    async getAllBlogs () {
        const blogs = await dbCollectionBlog.find({}).toArray()
        return blogs.map((blog) => {
            return {
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,}
        })
    },

    async findBlogById (id: string): Promise<BlogType | null> {
        const blogId = await dbCollectionBlog.findOne({_id: new ObjectId(id)})

        if(blogId) {
            const {_id, ...rest} = blogId
            return {...rest, id: blogId._id.toString()}
        }
        return null
    },

    async deleteBlogById (id: string) {
        const result = await dbCollectionBlog.deleteOne({_id: new ObjectId(id)})

        if (result.deletedCount === 0) {
            return false
        }
        return true
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
        const result = await dbCollectionBlog.insertOne({...newBlog})
      console.log(newBlog)
        return {...newBlog, id: result.insertedId.toString()}
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