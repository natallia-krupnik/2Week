import {body, validationResult} from "express-validator";
import {HTTP_STATUSES} from "../../types/statutes";
import {NextFunction, Request, Response} from "express";

export const ValidateBlog = () => {
    return [
        body('name')
            .notEmpty()
            .isString()
            .trim()
            .isLength({min:1, max: 15})
            .withMessage('Invalid Name'),

        body('description')
            .isString()
            .trim()
            .isLength({min: 1, max: 15})
            .withMessage('Invalid description'),

        body('websiteUrl')
            .isString()
            .trim()
            .isLength({ min: 1, max: 40 })
            .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
            .withMessage( 'Invalid websiteUrl'),
    ]
}

export const ErrorsBlogValidation = (req: Request, res: Response, next: NextFunction) => {
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
