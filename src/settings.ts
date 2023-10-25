import express, { Request, Response } from "express"
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {deleteAllRouter} from "./routers/delete-all-router";
import {authRouter} from "./routers/auth-router";
import {usersRouter} from "./routers/users-router";
import {commentsRouter} from "./routers/comments-router";

export const  app = express()

app.use(express.json())

app.use('/comments', commentsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing/all-data', deleteAllRouter)

export const settings = {
    JWT_SECRET: process.env.JWT_SECRET || '123'
}







