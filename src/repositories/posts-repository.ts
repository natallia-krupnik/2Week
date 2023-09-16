import {HTTP_STATUSES} from "../types/statutes";

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

export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

export const postsRepository = {
    getAllPosts() {
        return postDb
    },
    getPostByID(id:string) {
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
    deleteAll(){
        postDb.length = 0
        return true
    },
    createPost(newPost:PostType) {
        return postDb.push(newPost)
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
    }
}