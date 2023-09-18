import {body, param, validationResult, ValidationChain} from "express-validator";
import {HTTP_STATUSES} from "../../types/statutes";
import {NextFunction, Request, Response} from "express";

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
            .withMessage('Invalid blogId'),
    ]
}

export const ErrorsPostValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array({ onlyFirstError: true }).map(error => ErrorsFormatter)
        res.status(HTTP_STATUSES.bad_request_400).send(errorsMessages);
        return
    }
    next()
}

// @ts-ignore
const ErrorsFormatter = ({msg, param}) =>{
    return {
        message: msg,
        field: param
    }
}