import {CreatePostType, PostType} from "../types/types";
import {blogsRepository} from "./blogs-repository";
import {randomUUID} from "crypto";

let postDb: PostType[] = [
    {
        id: "string",
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId: "string",
        blogName: "string"
    }
]

export const postsRepository = {
    getAllPosts() {
        return postDb
    },
    findPostByID(id: string): PostType | undefined {
        const postById = postDb.find(post => post.id === id)
        return postById
    },
    deletePostById(id: string) {
        const indexOfDeletePost = postDb.findIndex(post => post.id === id)

        if (indexOfDeletePost === -1) {
            return false
        }
        postDb.splice(indexOfDeletePost, 1)
        return true
    },
    createPost(inputData: CreatePostType): PostType | null {
        const {title, shortDescription, content, blogId} = inputData
        const blog = blogsRepository.findBlogById(blogId)
        if (!blog) return null

        const newPost: PostType = {
            id: randomUUID(),
            title,
            shortDescription,
            content,
            blogId: blog.id,
            blogName: blog.name
        }
        postDb.push(newPost)
        return newPost
    },
    updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const blogIndex = postDb.findIndex(blog => blog.id === id)

        if (blogIndex === -1) {
            return false
        }

        postDb[blogIndex].title = title
        postDb[blogIndex].shortDescription = shortDescription
        postDb[blogIndex].content = content
        postDb[blogIndex].blogId = blogId

        return true
    },
    deleteAllPosts() {
        postDb = []

        return true
    }
}