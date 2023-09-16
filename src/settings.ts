import express, { Request, Response } from "express"
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";

export const  app = express()

app.use(express.json())

app.use('/blogs', blogsRouter)
app.use('/blog', postsRouter)







