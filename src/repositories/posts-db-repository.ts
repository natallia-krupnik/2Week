import {PostType, PostViewType, QueryTypeView} from "../types/types";
import { dbCollectionPost } from "../db/db";
import { ObjectId } from "mongodb";

type Test = {
    [key: string]: any
}

export const postsRepository = {

    async getAllPosts (defaultResult: QueryTypeView, blogId?: string) {
    const{pageNumber, pageSize, sortBy, sortDirection} = defaultResult
        const skip = (pageNumber -1) * pageSize
        const sort: Test = {}
        sort[sortBy] = sortDirection === 'asc' ? 1 : -1

        const posts = await dbCollectionPost
            .find({ blogId: blogId })
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .toArray()

        const totalCount = await dbCollectionPost.countDocuments({})

        const pagesCount = Math.ceil(totalCount/ pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(post => ({
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
            }))
        }
    },

//     async getAllPostsForBlog (defaultResult: QueryTypeView, blogId:string){
//     const { pageNumber, pageSize, sortBy, sortDirection } = defaultResult
//
//     const skip = (pageNumber-1)*pageSize
//
//     const sort = {}
//     sort
// },

    async findPostByID (id: string): Promise<PostViewType | null> {
        const post = await dbCollectionPost.findOne({_id: new ObjectId(id)})

        if(post) {
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
            }
        }
        return null
    },

    async createPost (newPost: PostType): Promise<PostViewType> {

        const res = await dbCollectionPost.insertOne((newPost))

        return {
            id: res.insertedId.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt
        }
    },

    async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const post = await dbCollectionPost.findOne({_id: new ObjectId(id)})

        if(!post) {
            return null
        }
        const updateField = {
            $set: {
                title,
                shortDescription,
                content,
                blogId,
            }
        }
        const result = await dbCollectionPost.updateOne({ _id: new ObjectId(id) }, updateField)

        return result.matchedCount === 1
    },

    async deletePostById (id: string) : Promise<boolean> {
        const result = await dbCollectionPost.deleteOne({_id: new ObjectId(id)})

        if (result.deletedCount === 0) {
            return false
        }
        return true    },

    async deleteAllPosts () {
        const result = await dbCollectionPost.deleteMany()
        return result.deletedCount > 0
    }
}