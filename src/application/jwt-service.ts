import jwt, {JwtPayload} from 'jsonwebtoken'
import {ObjectId, WithId} from "mongodb";
import {NewUserType, UserViewType} from "../types/types";
import {settings} from "../settings";

export const jwtService = {
    async createJWT(user: WithId<NewUserType>) {
        const token = jwt.sign({userId: user._id.toString(), userLogin: user.login}, settings.JWT_SECRET, {expiresIn: '7d'})
        return token
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)

            console.log(result, 'result')
            return {
                userId: new ObjectId(result.userId),
                userLogin: result.userLogin
            }
        } catch (error) {
            console.log(error, 'error')
            return null
        }
    }
}