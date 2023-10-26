import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../types/statutes";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain (business layer)/users-service";

// declare global {
//     namespace Express {
//         interface Request {
//             user: any; // Здесь укажите тип вашего пользователя
//         }
//     }
// }

export const BearerAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction) => {

    const authString = req.headers.authorization

    console.log(authString, 'authString')
    if(!authString) {
        res.sendStatus(HTTP_STATUSES.unauthorized_401)
        return
    }

    const token = authString.split(' ')[1]

    console.log(token, 'token')
    const jwtData = await jwtService.getUserIdByToken(token)

    console.log(jwtData, 'jwtData')

    if(jwtData){
        const userIdString = jwtData.userId.toString()
        const user = await usersService.findUserById(userIdString)

        console.log(user, 'user')
        if(user){
            req.user = user
            return next()
        }
    }
    res.sendStatus(HTTP_STATUSES.unauthorized_401)
}