import {NewUserType, QueryTypeViewUsers, UserInputType, UserViewType} from "../types/types";
import {usersRepository} from "../repositories/users-db-repository";
import bcrypt from 'bcrypt'

function mapUserToView(userFromDb: NewUserType): UserViewType {
    return {
        id: userFromDb.id,
        login: userFromDb.userName,
        email: userFromDb.email,
        createdAt: userFromDb.createdAt,
    }
}
export const usersService = {

    async getAllUsers(defaultQuery: QueryTypeViewUsers) {
        return await usersRepository.getAllUsers(defaultQuery)
    },

    async createUser(inputData: UserInputType): Promise<UserViewType> {
        let {login, password, email} = inputData

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: NewUserType = {
            id: new Date().getTime().toString(),
            userName: login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString()
        }
        await usersRepository.createUser(newUser)

        return mapUserToView(newUser)
    },

    async findUserById(id: string) {
        return await usersRepository.findUserById(id)
    },

    async deleteUserById(id: string) {
        return await usersRepository.deleteUserById(id)
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) {
            return false
        }

        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash != passwordHash) {
            return false
        }
        return true
    },

    async _generateHash(password: string, passwordSalt: string) {
        const hash = await bcrypt.hash(password, passwordSalt)
        console.log('hash:' + hash)
        return hash
    }
}