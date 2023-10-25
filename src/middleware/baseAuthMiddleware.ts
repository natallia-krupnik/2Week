import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../types/statutes";
import {blogsRouter} from "../routers/blogs-router";

// const expectedAuthHeader = 'admin:qwerty'
const expectedAuthHeader = 'Basic YWRtaW46cXdlcnR5'
export const BaseAuthMiddleware = (
    req: Request,
    res:Response,
    next: NextFunction) => {

    const authHeader = req.headers.authorization

    if(!authHeader || authHeader !==  expectedAuthHeader) {
        res.sendStatus(HTTP_STATUSES.unauthorized_401)
        return
    }

    return next()
}