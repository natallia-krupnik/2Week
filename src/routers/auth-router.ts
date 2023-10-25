import {Response, Request, Router} from "express";
import {RequestWithBody } from "../types/requests";
import {AuthInputType} from "../types/types";
import {HTTP_STATUSES} from "../types/statutes";
import {usersService} from "../domain (business layer)/users-service";
import {AuthBodyValidation} from "../middleware/auth/auth-validation-middleware";
import {ErrorsValidation} from "../middleware/errorsValidation";
import {jwtService} from "../application/jwt-service";
import {BearerAuthMiddleware} from "../middleware/bearerAuthMiddleware";


export const authRouter = Router({})

authRouter.post(
    '/login',
    AuthBodyValidation(),
    ErrorsValidation,
    async (req: RequestWithBody<AuthInputType>, res: Response) => {

        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (user) {
            const token = await jwtService.createJWT(user)
            return res.status(HTTP_STATUSES.created_201).send(token)
        }

        return res.sendStatus(HTTP_STATUSES.unauthorized_401)
    })

// get information about current user
authRouter.get(
    '/me',
    BearerAuthMiddleware,
    async (req: Request, res: Response) => {

        const userId = req.user.id //правильно?
        if (!userId) {
            return res.sendStatus(HTTP_STATUSES.unauthorized_401)
        }

        const user = await usersService.findUserById(userId)
        if(!user){
            return res.sendStatus(HTTP_STATUSES.unauthorized_401)
        }
        return res.status(HTTP_STATUSES.ok_200).send({
            email: user.email,
            login: user.login,
            userId: user.id
        })
    })