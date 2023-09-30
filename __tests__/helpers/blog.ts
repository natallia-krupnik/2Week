import {BlogType, CreateBlogType} from "../../src/types/types";

export const createBlog = ():BlogType => ({
    name: 'it-incubator',
    description: 'i am learning',
    websiteUrl: 'http://cccc.com',
    createdAt: new Date().toISOString(),
    isMembership: false
})

