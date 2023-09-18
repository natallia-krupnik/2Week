import {NextFunction, Request, Response} from "express";
import {ValidationError, validationResult} from "express-validator";
import {HTTP_STATUSES} from "../types/statutes";

export const ErrorsValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsMessages = errors
            .array({ onlyFirstError: true }).map(error => ErrorsFormatter(error))
        res.status(HTTP_STATUSES.bad_request_400).send({errorsMessages});
        return
    }
    next()
}

const ErrorsFormatter = ( error: ValidationError) => {
    switch (error.type){
        case "field":
            console.log(error, 'in formatter')
            return  {
                message: error.msg,
                field: error.path
            }
        default:
            return {
                message: error.msg,
                field: 'None'
            }
    }
}