import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {UserViewType} from "../types/types";
import {settings} from "../settings";

export const jwtService = {
    async createJWT(user: UserViewType) {
        const token = jwt.sign({userId: user.id, userLogin: user.login}, settings.JWT_SECRET, {expiresIn: '7d'})
        return token
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return {
                userId: new ObjectId(result.userId),
                userLogin: result.userLogin
            }
        } catch (error) {
            return null
        }
    }
}