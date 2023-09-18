let blogDb: BlogType[] = [
    {
        id: "string",
        name: "string",
        description: "string",
        websiteUrl: "string"
    }
]
export type BlogType = {
    id: string
    name: string
    description: string
    websiteUrl: string
}

export const blogsRepository = {
    getAllBlogs() {
        return blogDb
    },
    findBlogById(id: string){
        const blog = blogDb.find((blog) => blog.id === id)
        return blog
    },
    createBlog(newBlog: BlogType) {
        return blogDb.push(newBlog)
    },
    deleteBlogById(id: string) {
        const indexOfDeletedBlog  = blogDb.findIndex(blog => blog.id === id)
        if(indexOfDeletedBlog  === -1){
            return false
        }
        blogDb.splice(indexOfDeletedBlog , 1)
        return true
    },
    deleteAll(){
        blogDb = []
        return true
    },
    updateBlogById(id: string, name: string, description: string, websiteUrl: string) {
        const indexOfUpdatedBlog = blogDb.findIndex(blog => blog.id === id)
        if(indexOfUpdatedBlog === -1) {
            return false
        }
        blogDb[indexOfUpdatedBlog].name = name
        blogDb[indexOfUpdatedBlog].description = description
        blogDb[indexOfUpdatedBlog].websiteUrl = websiteUrl

        return true
    }
}