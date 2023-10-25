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
    if(!authString) {
        res.status(HTTP_STATUSES.unauthorized_401)
        return
    }

    const token = authString.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)

    if(userId){
        const userIdString = userId.toString()
        req.user = await usersService.findUserById(userIdString)
        next()
    }
    res.status(HTTP_STATUSES.unauthorized_401)
}