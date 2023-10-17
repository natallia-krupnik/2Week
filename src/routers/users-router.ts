import {Request, Response, Router} from "express";
import {RequestWithBody, RequestWithParams} from "../types/requests";
import {ExtendsQueryParamsInput, UserInputType, UserViewType} from "../types/types";
import {AuthValidation} from "../middleware/auth/auth-validation-middleware";
import {usersService} from "../domain (business layer)/users-service";
import {HTTP_STATUSES} from "../types/statutes";
import {sortQueryParamsUsers} from "./helpers/helpers-posts-blogs";
import {authGuardMiddleware} from "../middleware/authGuardMiddleware";


export const usersRouter = Router({})

usersRouter.get (
    '/',
    authGuardMiddleware,
    async (req:RequestWithParams<ExtendsQueryParamsInput>,
                    res:Response) => {
    const defaultQuery = sortQueryParamsUsers(req.query)
    const allUsers = await usersService.getAllUsers(defaultQuery)

    res.status(HTTP_STATUSES.ok_200).send(allUsers)
    }
)

usersRouter.post(
    '/',
    authGuardMiddleware,
    AuthValidation(),
    async (req: RequestWithBody<UserInputType>, res: Response<UserViewType>) => {

        const createdUser = await usersService.createUser({ login: req.body.login, email: req.body.email, password: req.body.password} )

        if(createdUser) {
            res.status(HTTP_STATUSES.created_201).send(createdUser)
        }
    }
)

usersRouter.delete(
    '/:id',
    authGuardMiddleware,
    async (req: Request<{id: string}>, res: Response) => {
        const id = req.params.id

        const user = await usersService.findUserById(id)
        if(!user) {
            return res.status(HTTP_STATUSES.not_found_404).send(`User doesn't exist`)
        }

        const deletedUserById = await usersService.deleteUserById(id)
        if(!deletedUserById) {
            return res.status(HTTP_STATUSES.not_found_404).send(`User doesn't exist`)
        }

        return res.status(HTTP_STATUSES.no_content_204).send('No content')
    })