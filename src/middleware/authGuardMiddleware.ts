import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../types/statutes";

const expectedAuthHeader = 'admin:qwerty'
export const authGuardMiddleware = (req: Request, res:Response, next: NextFunction) => {

    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Basic ')) {
        res.sendStatus(HTTP_STATUSES.unauthorized_401)
        return
    }

    const splitHeader = authHeader.split(' ')[1]
    // const enCodedHeader = atob(splitHeader)
    const enCodedHeader = Buffer.from(splitHeader, 'base64')

    // if(enCodedHeader !== expectedAuthHeader) {
    //     res.sendStatus(HTTP_STATUSES.unauthorized_401)
    // }
    if(enCodedHeader.toString() !== expectedAuthHeader) {
        res.sendStatus(HTTP_STATUSES.unauthorized_401)
    }
    return next()
}