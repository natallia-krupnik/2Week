import {Response, Request, Router} from "express";
import {RequestWithBody } from "../types/requests";
import {AuthInputType, UserInputType} from "../types/types";
import {HTTP_STATUSES} from "../types/statutes";
import {usersService} from "../domain (business layer)/users-service";
import {AuthBodyValidation, RegistrationValidation} from "../middleware/auth/registration-validation-middleware";
import {ErrorsValidation} from "../middleware/errorsValidation";
import {jwtService} from "../application/jwt-service";
import {BearerAuthMiddleware} from "../middleware/bearerAuthMiddleware";
import {CodeConfirmationValidation} from "../middleware/auth/code-confirmation-validation-middleware";
import {EmailValidation} from "../middleware/auth/email-validation-middleware";

export const authRouter = Router({})

authRouter.post(
    '/registration-email-resending',
    EmailValidation,
    ErrorsValidation,
    async (req: RequestWithBody<{email: string}>, res: Response)=> {
        await usersService.resendEmail(req.body.email)

        return res
            .status(HTTP_STATUSES.no_content_204)
            .send('Input data is accepted. Email with confirmation code will be send to passed email address. ')
}
)
authRouter.post(
    '/registration-confirmation',
    CodeConfirmationValidation(),
    ErrorsValidation,
    async (req: RequestWithBody<{code: string}>, res: Response) => {
        await usersService.findUserByConfirmationCode(req.body.code)

        return res
            .status(HTTP_STATUSES.no_content_204)
            .send('Email was verified. Account was activated')
    }
)
authRouter.post(
    '/registration',
    RegistrationValidation(),
    ErrorsValidation,
    async (req: RequestWithBody<UserInputType>, res: Response) => {
        const createdUser = await usersService.createUser({
            login: req.body.login,
            email: req.body.email,
            password: req.body.password
        })

        if(!createdUser){
            return null
        }

        await usersService.sendConfirmation(createdUser.id)

        return res
            .status(HTTP_STATUSES.no_content_204)
            .send('Input data is accepted. Email with confirmation code will be send to passed email address')
    })

authRouter.post(
    '/login',
    AuthBodyValidation(),
    ErrorsValidation,
    async (req: RequestWithBody<AuthInputType>, res: Response) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (user) {
            const token = await jwtService.createJWT(user)
            return res.status(HTTP_STATUSES.ok_200).send({accessToken: token})
        }

        return res.sendStatus(HTTP_STATUSES.unauthorized_401)
    })

// get information about current user
authRouter.get(
    '/me',
    BearerAuthMiddleware,
    async (req: Request, res: Response) => {

        const userId = req.user._id //правильно?
        if (!userId) {
            return res.sendStatus(HTTP_STATUSES.unauthorized_401)
        }

        const user = await usersService.findUserById(userId)
        if(!user){
            return res.sendStatus(HTTP_STATUSES.unauthorized_401)
        }
        return res
            .status(HTTP_STATUSES.ok_200)
            .send({
            email: user.accountData.email,
            login: user.accountData.login,
            userId: user._id
        })
    })