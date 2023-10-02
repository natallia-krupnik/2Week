import request from 'supertest'
import {app} from "../../src";
import {HTTP_STATUSES} from "../../src/types/statutes";
import {createBlog} from "../helpers/blog";
import {createPost, createPostTwo} from "../helpers/post";
import {response} from "express";
import {ObjectId} from "mongodb";


export type BlogViewType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    isMembership: boolean,
    createdAt: string
}
describe('/posts', () => {
    jest.setTimeout(10000)
    let post: any
    let postTwo: any
    let blog: BlogViewType
    let createdPost: any

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204)

        const response = await request(app)
            .post('/blogs')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(createBlog())
            .expect(201)
        blog = response.body

        post = await request(app)
            .post('/posts')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({...createPost(), blogId: blog.id})
        //console.log('newPost', post.body)
    })

    afterAll((done)=> done())

    it('should create one more post with correct input data', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'I like Paris',
                shortDescription: 'paris is beautiful',
                content: 'super - puper - super',
                blogId: blog.id
            })
            .expect(HTTP_STATUSES.created_201)

        createdPost = createResponse.body

        expect(createdPost).toEqual({
            id: expect.any(String),
            title: 'I like Paris',
            shortDescription: 'paris is beautiful',
            content: 'super - puper - super',
            blogId: blog.id,
            blogName: blog.name,
            createdAt: expect.any(String)
        })

        const arrayOfPosts = await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.ok_200)

        expect(arrayOfPosts.body.length).toBe(2)

    })

    it(`shouldn't create with incorrect data. `, async () => {
        await request(app)
            .post('/posts')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: '',
                blogId: blog.id
            })
            .expect(HTTP_STATUSES.bad_request_400)
    })

    //ich hat post, postTwo und 'one more post' z.43
    it('should GET all posts', async ()=> {
        postTwo = await request(app)
            .post('/posts')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({...createPostTwo(), blogId: blog.id})

        const response = await request(app)
            .get('/posts')

        expect(response.status).toBe(200)
        expect(response.body.length).toBe(3)
    })

    it('should GET posts by id', async () => {


        const  response = await request(app)
            .get(`/posts/${post.body.id}`)


        expect(response.body.id).toBe(post.body.id)
    })

    it('should GET 404 for not existing post', () => {
        request(app)
            .get(`/posts/${post.id}`)
            .expect(HTTP_STATUSES.not_found_404)
    })

    it(`should update post with correct input data`, async ()=> {

        console.log('postId in update:', post.body.id)
        await request(app)
            .put(`/posts/${post.body.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'New good title',
                blogId: blog.id,
                shortDescription: 'the best Post',
                content: 'super',

            })
            .expect(204)

        const updatedPost = await request(app).get(`/posts/${post.body.id}`).expect(200)

            expect(updatedPost.body).toEqual({
            id: expect.any(String),
            title: 'New good title',
            shortDescription: 'the best Post',
            content: 'super',
            blogId: blog.id,
            blogName: blog.name,
            createdAt: expect.any(String)
        })
    })

    it(`shouldn't update post with incorrect input data`, async ()=> {

        const notStringData = await request(app)
            .put(`/posts/${post.body.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({title: '', blogId: blog.id})
            .expect(HTTP_STATUSES.bad_request_400)

        expect(notStringData.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'title'
                },
                {
                    message: expect.any(String),
                    field: 'shortDescription'
                },
                {
                    message: expect.any(String),
                    field: 'content'
                }

            ]
        })
    })

    it(`shouldn't update post that not exist`, async ()=> {
        // const invalidId = '111a11b1-11c1-1111-1111-d1e1ab11c111';
        //
        // const existingPost = await request(app)
        //     .get(`/posts/${invalidId}`)
        //     .expect(HTTP_STATUSES.not_found_404);
        //
        // if (existingPost.status === 404) {
        //     expect(existingPost.body).toEqual({
        //         message: 'Post not found',
        //     });
        // }
        const invalidId = new ObjectId()

        const existingPost = await request(app)
            .put(`/posts/${invalidId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({title: 'I am gut', blogId: blog.id, shortDescription: "ffsdfsd", content: 'fsdfsd'})
            .expect(HTTP_STATUSES.not_found_404)
    })

    it('should delete post by ID', async() => {
        await request(app)
            .delete(`/posts/${post.body.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.no_content_204)

        await request(app)
            .get(`/posts/${post.body.id}`)
            .expect(HTTP_STATUSES.not_found_404)
    })

    it(`shouldn't delete post by incorrect ID`, async() => {
        await request(app)
            .delete(`/posts/${post.body.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.not_found_404)
    })
})