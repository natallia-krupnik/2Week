import {BlogDBType} from "../types/types";
import {ObjectId} from "mongodb";
import {dbCollectionBlog} from "../db/db";
import {BlogViewType} from "../../__tests__/e2e/posts-api.test";

export const blogsRepository = {
    async getAllBlogs () {
        const blogs = await dbCollectionBlog.find({}).toArray()
        return blogs.map((blog) => {
            return {
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                isMembership: blog.isMembership,
                createdAt: blog.createdAt
            }
        })
    },

    async findBlogById (id: string): Promise<BlogViewType | null> {
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

    async createBlog(inputData: { name: string; description: string; websiteUrl: string }): Promise<BlogViewType> {
        let { name, description, websiteUrl } = inputData

        const newBlog: BlogDBType = {
            _id: new ObjectId(),
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        await dbCollectionBlog.insertOne(newBlog)

        return {
            id: newBlog._id.toString(),
            name: newBlog.name,
            description: newBlog.description,
            createdAt: newBlog.createdAt,
            websiteUrl: newBlog.websiteUrl,
            isMembership: newBlog.isMembership
        }
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