import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../types/statutes";
import {blogsRouter} from "../routers/blogs-router";

// const expectedAuthHeader = 'admin:qwerty'
const expectedAuthHeader = 'Basic YWRtaW46cXdlcnR5'
export const authGuardMiddleware = (req: Request, res:Response, next: NextFunction) => {

    const authHeader = req.headers.authorization

    if(!authHeader || authHeader !==  expectedAuthHeader) {
        res.sendStatus(HTTP_STATUSES.unauthorized_401)
        return
    }

    // const splitHeader = authHeader.split(' ')[1]
    // // const enCodedHeader = atob(splitHeader)
    // const enCodedHeader = Buffer.from(splitHeader, 'base64').toString()
    // console.log(enCodedHeader)
    // // if(enCodedHeader !== expectedAuthHeader) {
    // //     res.sendStatus(HTTP_STATUSES.unauthorized_401)
    // // }
    // if(enCodedHeader !== expectedAuthHeader) {
    //    return res.sendStatus(HTTP_STATUSES.unauthorized_401)
    // }
    return next()
}