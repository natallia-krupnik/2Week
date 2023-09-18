import { body } from "express-validator";
import {blogsRepository} from "../../repositories/blogs-repository";

export const ValidatePost = ()=> {
    return [
        body('title')
            .notEmpty()
            .isString()
            .trim()
            .isLength({min:1, max: 30})
            .withMessage('Invalid title'),

        body('shortDescription')
            .notEmpty()
            .isString()
            .trim()
            .isLength({min: 1, max: 100})
            .withMessage('Invalid shortDescription'),

        body('content')
            .notEmpty()
            .isString()
            .trim()
            .isLength({ min: 1, max: 1000 })
            .withMessage('Invalid content'),

        body('blogId')
            .notEmpty()
            .isString()
            .trim()
            .custom((value) => {
                const blogIsExist = blogsRepository.findBlogById(value);

                if(!blogIsExist){
                    throw new Error('Blog not exist')
                }

                return true
            })
            .withMessage('Invalid blogId'),
    ]
}