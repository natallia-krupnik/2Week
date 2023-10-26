import {NewUserType, QueryTypeViewUsers, UserInputType, UserViewType} from "../types/types";
import {usersRepository} from "../repositories/users-db-repository";
import bcrypt from 'bcrypt'

// function mapUserToView(userFromDb: NewUserType): UserViewType {
//     return {
//         id: userFromDb.id,
//         login: userFromDb.userName,
//         email: userFromDb.email,
//         createdAt: userFromDb.createdAt,
//     }
// }
export const usersService = {

    async getAllUsers(defaultQuery: QueryTypeViewUsers) {
        return await usersRepository.getAllUsers(defaultQuery)
    },

    async createUser(inputData: UserInputType): Promise<UserViewType> {
        let {login, password, email} = inputData

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: NewUserType = {
            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString()
        }

        const res = await usersRepository.createUser({...newUser})

        return {
            id: res.insertedId.toString(),
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt,
        }
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
            return null
        }

        const passwordHash = await this._generateHash(password, user.passwordSalt)

        if (user.passwordHash != passwordHash) {
            return null
        }

        return user
    },

    async _generateHash(password: string, passwordSalt: string) {
        const hash = await bcrypt.hash(password, passwordSalt)
        console.log('hash:' + hash)
        return hash
    },

    async deleteAllUsers() {
        return await usersRepository.deleteAllUsers()
    }
}