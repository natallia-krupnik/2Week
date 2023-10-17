import { body } from "express-validator";

export const AuthValidation = ()=> {
    return [
        body('login')
            .notEmpty()
            .isString()
            .trim()
            .isLength({min:3, max:10})
            .matches(/^[a-zA-Z0-9_-]*$/)
            .withMessage('Invalid loginOrEmail'),

        body('password')
            .notEmpty()
            .isString()
            .trim()
            .isLength({min:6, max:20})
            .withMessage('Invalid password'),

        body('email')
            .notEmpty()
            .isString()
            .trim()
            .isEmail()
            .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
            .withMessage('Invalid email'),
    ]
}

export const AuthValid = ()=> {
    return [
        body('loginOrEmail')
            .notEmpty()
            .isString()
            .trim()
            .isLength({min:1})
            .withMessage('Invalid loginOrEmail'),

        body('password')
            .notEmpty()
            .isString()
            .trim()
            .isLength({min:1})
            .withMessage('Invalid password'),
    ]
}