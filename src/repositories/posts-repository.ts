import { PostType } from "../types/types";

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
    findPostByID(id:string): PostType | undefined {
        const postById = postDb.find(post => post.id === id)
        return postById
    },
    deletePostById(id:string) {
        const indexOfDeletePost = postDb.findIndex(post => post.id === id)

        if(indexOfDeletePost === -1) {
            return false
        }
        postDb.splice(indexOfDeletePost, 1)
        return true
    },
    createPost(newPost:PostType) {
        postDb.push(newPost)
    },
    updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const blogIndex = postDb.findIndex(blog => blog.id === id)

        if(blogIndex === -1) {
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