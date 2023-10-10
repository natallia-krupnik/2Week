import {BlogType, QueryTypeViewBlogs} from "../types/types";
import { BlogViewType } from "../__tests__/e2e/posts-api.test";
import { blogsRepository } from "../repositories/blogs-db-repository";

export const blogsService = {

    async getAllBlogs (defaultResult: QueryTypeViewBlogs) {
        return await blogsRepository.getAllBlogs(defaultResult)
    },

    async createBlog(inputData: { name: string; description: string; websiteUrl: string }): Promise<any> {
        let { name, description, websiteUrl } = inputData

        const newBlog: BlogType = {
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        return await blogsRepository.createBlog(newBlog)
    },

    async findBlogById (id: string): Promise<BlogViewType | null>{
        return await blogsRepository.findBlogById(id)
    },

    async updateBlogById(id: string, name: string, description: string, websiteUrl: string) {
        return await blogsRepository.updateBlogById(id, name, description, websiteUrl)
    },

    async deleteBlogById (id: string) {
        return await blogsRepository.deleteBlogById(id)
    },

    async deleteAllBlogs() {
        return await blogsRepository.deleteAllBlogs()
    }
}