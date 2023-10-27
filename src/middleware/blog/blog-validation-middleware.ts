import { body } from "express-validator";

export const ValidateBlog = () => {
    return [
        body('name')
            .notEmpty()
            .isString()
            .trim()
            .isLength({min:1, max: 15})
            .withMessage('Invalid Name'),

        body('description')
            .notEmpty()
            .isString()
            .trim()
            .isLength({min: 1, max: 500})
            .withMessage('Invalid description'),

        body('websiteUrl')
            .notEmpty()
            .isString()
            .trim()
            .isLength({ min: 1, max: 100 })
            .isURL()
            .withMessage( 'Invalid websiteUrl'),
    ]
}
