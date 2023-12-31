import dotenv from 'dotenv'
dotenv.config()
import { MongoClient } from "mongodb";
import {BlogType, NewAuthUserType, NewUserType, PostDBType, PostType} from "../types/types";
import {NewCommentDB} from "../types/comments/comments";

const mongoUri = process.env.MONGO_URL || ''

const client = new MongoClient(mongoUri)
const db = client.db('shop-it')

export const dbCollectionComments = db.collection<NewCommentDB>('comments')
export const dbCollectionBlog = db.collection <BlogType> ('blogs')
export const dbCollectionPost = db.collection <PostType> ('posts')

export const dbCollectionUser = db.collection<NewAuthUserType>('users')

export async function runDb(){
    try {
        // Connect the client to the server
        await  client.connect()

        // Establish and verify connection
        await client.db('test').command({ ping: 1 })

        console.log('Connected successfully to mongo server')
    } catch {
        // Ensures that the client will close when you finish/ error
        await client.close()
    }
}