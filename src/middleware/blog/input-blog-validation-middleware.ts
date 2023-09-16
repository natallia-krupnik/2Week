import {body, param, validationResult, ValidationChain} from "express-validator";
import {HTTP_STATUSES} from "../../types/statutes";
import {NextFunction, Request, Response} from "express";

export const validateBlog = (): ValidationChain[] => {
    return [
        body('name')
            .notEmpty()
            .trim()
            .isLength({min:1, max: 15})
            .isString()
            .withMessage({message: 'Invalid Name', field: 'name'}),

        body('description')
            .trim()
            .isString()
            .isLength({min: 1, max: 15})
            .withMessage({message: 'Invalid description', field: 'description'}),

        body('websiteUrl')
            .trim()
            .isString()
            .isLength({ min: 1, max: 40 })
            .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
            .withMessage({message: 'Invalid websiteUrl', field: 'websiteUrl'}),
    ]
}

export const errorsBlogValidation = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            res.status(HTTP_STATUSES.bad_request_400).send(errors);
            return
        }
        next()
    };
}

