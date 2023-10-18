import {Response, Router} from "express";
import {RequestWithBody, RequestWithParams} from "../types/requests";
import {AuthInputType} from "../types/types";
import {HTTP_STATUSES} from "../types/statutes";
import {usersService} from "../domain (business layer)/users-service";
import {AuthValid} from "../middleware/auth/auth-validation-middleware";
import {ErrorsValidation} from "../middleware/errorsValidation";


export const authRouter = Router({})

authRouter.post(
    '/login',
    AuthValid(),
    async (req: RequestWithBody<AuthInputType>, res: Response) => {

        const checkResult = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (!checkResult) {
            return res.sendStatus(HTTP_STATUSES.unauthorized_401)
        }

        return res.sendStatus(HTTP_STATUSES.no_content_204)
    })