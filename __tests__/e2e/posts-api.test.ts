import request from 'supertest'
import {app} from "../../src";
import {HTTP_STATUSES} from "../../src/types/statutes";
import {createBlog} from "../helpers/blog";
import {createPost, createPostTwo} from "../helpers/post";
import {response} from "express";
import {BlogType} from "../../src/types/types";

export type BlogViewType = {
    _id: string,
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
            .send({...createPost(), blogId: blog._id})
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
                blogId: blog._id
            })
            .expect(HTTP_STATUSES.created_201)

        createdPost = createResponse.body

        expect(createdPost).toEqual({
            _id: expect.any(String),
            title: 'I like Paris',
            shortDescription: 'paris is beautiful',
            content: 'super - puper - super',
            blogId: blog._id,
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
                blogId: blog._id
            })
            .expect(HTTP_STATUSES.bad_request_400)
    })

    //ich hat post, postTwo und 'one more post' z.43
    it('should GET all posts', async ()=> {
        postTwo = await request(app)
            .post('/posts')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({...createPostTwo(), blogId: blog._id})

        const response = await request(app)
            .get('/posts')

        expect(response.status).toBe(200)
        expect(response.body.length).toBe(3)
    })

    it('should GET posts by id', async () => {
        const  response = await request(app)
            .get(`/posts/${post.body._id}`)

        expect(response.body._id).toBe(post.body._id)
    })

    it('should GET 404 for not existing post', () => {
        request(app)
            .get(`/posts/${post.id}`)
            .expect(HTTP_STATUSES.not_found_404)
    })

    it(`should update post with correct input data`, async ()=> {
        const updatedPost = await request(app)
            .put(`/posts/${post.body._id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'New good title',
            })
            .expect(HTTP_STATUSES.no_content_204)

        expect(updatedPost.body).toEqual({
            _id: expect.any(String),
            title: 'New good title',
            shortDescription: 'the best Post',
            content: 'super',
            blogId: blog._id,
            blogName: blog.name,
            createdAt: expect.any(String)
        })
    })

    it(`shouldn't update post with incorrect input data`, async ()=> {

        const notStringData = await request(app)
            .put(`/posts/${post.body._id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({title: ''})
            .expect(HTTP_STATUSES.bad_request_400)

        expect(notStringData.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'title'
                }
            ]
        })
    })

    it(`shouldn't update post that not exist`, async ()=> {
        const invalidId = '000000000000000000000000'
        await request(app)
            .put(`/posts/${invalidId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({title: 'I am gut'})
            .expect(HTTP_STATUSES.not_found_404)
    })

    it('should delete post by ID', async() => {
        await request(app)
            .delete(`/posts/${post.body._id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.no_content_204)

        await request(app)
            .get(`/posts/${post.body._id}`)
            .expect(HTTP_STATUSES.not_found_404)
    })

    it(`shouldn't delete post by incorrect ID`, async() => {
        await request(app)
            .delete(`/posts/${post.body._id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.not_found_404)
    })
})