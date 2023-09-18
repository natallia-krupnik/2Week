import {body, param, validationResult, ValidationChain} from "express-validator";
import {HTTP_STATUSES} from "../../types/statutes";
import {NextFunction, Request, Response} from "express";

export const validatePost = (): ValidationChain[] => {
    return [
        body('title')
            .notEmpty()
            .isString()
            .trim()
            .isLength({min:1, max: 30})
            .withMessage({message: 'Invalid Name', field: 'title'}),

        body('shortDescription')
            .notEmpty()
            .isString()
            .trim()
            .isLength({min: 1, max: 100})
            .withMessage({message: 'Invalid shortDescription', field: 'shortDescription'}),

        body('content')
            .notEmpty()
            .isString()
            .trim()
            .isLength({ min: 1, max: 1000 })
            .withMessage({message: 'Invalid content', field: 'content'}),

        body('blogId')
            .notEmpty()
            .isString()
            .trim()
            .withMessage({message: 'Invalid blogId', field: 'blogId'}),
    ]
}

export const errorsPostValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
        res.status(HTTP_STATUSES.bad_request_400).send(errors);
        return
    }
    next()
}

