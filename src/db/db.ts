import dotenv from 'dotenv'
dotenv.config()
import { MongoClient } from "mongodb";
import { BlogType, PostType } from "../types/types";

const mongoUri = process.env.MONGO_URL || ''

const client = new MongoClient(mongoUri)
const db = client.db('shop-it')
export const dbCollectionBlog = db.collection <BlogType> ('blogs')
export const dbCollectionPost = db.collection <PostType> ('posts')




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