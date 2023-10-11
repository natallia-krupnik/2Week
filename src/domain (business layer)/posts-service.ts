import {CreateInputData, PostType, PostViewType, QueryTypeView} from "../types/types";
import {blogsRepository} from "../repositories/blogs-db-repository";
import {postsRepository} from "../repositories/posts-db-repository";
import {HTTP_STATUSES} from "../types/statutes";


export const postsService = {

    async getAllPosts (defaultResult:QueryTypeView, blogId?:string) {
        return await postsRepository.getAllPosts(defaultResult, blogId)
    },

    async createPost (inputData: CreateInputData): Promise<PostViewType> {
        const {title, shortDescription, content,blogId} = inputData

        const blog = await  blogsRepository.findBlogById(blogId);
        // if(!blog) {
        //     throw new Error('404')
        // }
        const newPost: PostType = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString()
        }

        return await postsRepository.createPost(newPost)
    },

    async findPostByID (id: string): Promise<PostViewType | null> {
        return await postsRepository.findPostByID(id)
    },

    async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean | null>{
        return await postsRepository.updatePostById(id, title, shortDescription, content, blogId)
    },

    async deletePostById (id: string) : Promise<boolean> {
        return await postsRepository.deletePostById(id)
    },

    async deleteAllPosts (): Promise<boolean>{
        return await postsRepository.deleteAllPosts()
    }
}