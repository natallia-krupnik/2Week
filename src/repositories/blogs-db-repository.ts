import {BlogDBType, BlogType, QueryTypeViewBlogs} from "../types/types";
import {ObjectId} from "mongodb";
import {dbCollectionBlog} from "../db/db";
import {BlogViewType} from "../__tests__/e2e/posts-api.test";


type Blog = {
    [key: string]: any
}

export const blogsRepository = {

    async getAllBlogs (defaultResult: QueryTypeViewBlogs) {

        const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = defaultResult
        const skip = (pageNumber - 1) * pageSize

        const sort: Blog = {}
        sort[sortBy] = sortDirection === 'desc'? -1: 1

        const query: any = {}
        if(searchNameTerm) {
            query.name = { $regex: searchNameTerm, $options: 'i'}
        }

        const blogs = await dbCollectionBlog
            .find(query)
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .toArray()

        const totalCount = await dbCollectionBlog.countDocuments(query) // нужен query так как без него даст все доки
        const pagesCount = Math.ceil(totalCount/ pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: blogs.map(blog => ({
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                isMembership: blog.isMembership,
                createdAt: blog.createdAt
            }))
        }
    },

    async createBlog(newBlog: BlogType): Promise<BlogViewType> {
        const res = await dbCollectionBlog.insertOne({...newBlog})

        return {
            id: res.insertedId.toString(),
            name: newBlog.name,
            description: newBlog.description,
            createdAt: newBlog.createdAt,
            websiteUrl: newBlog.websiteUrl,
            isMembership: newBlog.isMembership
        }
    },

    async findBlogById (id: string): Promise<BlogViewType | null>{
        //моя проверка на id
        if (!ObjectId.isValid(id)) return null

            const blogId = await dbCollectionBlog.findOne({_id: new ObjectId(id)})

            if(blogId) {
                const {_id, ...rest} = blogId
                return {...rest, id: blogId._id.toString()}
            }
            return null
    },

    async updateBlogById(id: string, name: string, description: string, websiteUrl: string) {
        //моя проверка на id
        if (!ObjectId.isValid(id)) return null
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

    async deleteBlogById (id: string) {
        //моя проверка на id
        if (!ObjectId.isValid(id)) return null

        const result = await dbCollectionBlog.deleteOne({_id: new ObjectId(id)})

        if (result.deletedCount === 0) {
            return false
        }
        return true
    },

    async deleteAllBlogs() {
        const resul = await dbCollectionBlog.deleteMany({})

        return resul.deletedCount > 0
    }
}