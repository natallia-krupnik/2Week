import {
    NewAuthUserType,
    QueryTypeViewUsers,
    UserInputType,
    UserViewType
} from "../types/types";
import {usersRepository} from "../repositories/users-db-repository";
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
import {add} from 'date-fns'
import {emailAdapter} from "../adapters/email-adapter";
import {ObjectId} from "mongodb";

// function mapUserToView(userFromDb: NewUserType): UserViewType {
//     return {
//         id: userFromDb.id,
//         login: userFromDb.userName,
//         email: userFromDb.email,
//         createdAt: userFromDb.createdAt,
//     }
// }
export const usersService = {

    async createUser(inputData: UserInputType): Promise<UserViewType> {
        let {login, password, email} = inputData

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: NewAuthUserType = {
            accountData: {
                login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date().toISOString(),
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    // minutes: 3,
                    seconds: 30,
                }),
                isConfirmed: false
            }
        }

        const res = await usersRepository.createUser(newUser)

        return {
            id: res.insertedId.toString(),
            login: newUser.accountData.login,
            email: newUser.accountData.email,
            createdAt: newUser.accountData.createdAt,
        }
    },

    async getAllUsers(defaultQuery: QueryTypeViewUsers) {
        return await usersRepository.getAllUsers(defaultQuery)
    },

    async findUserById(id: string) {
        return await usersRepository.findUserById(id)
    },

    async findUserByConfirmationCode(code: string) {
        const user = await usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate > new Date()) return false

        return await usersRepository.updateConfirmation(user._id)
    },

    async resendEmail(email: string) {
        const user = await usersRepository.findUserByLoginOrEmail(email)

        if (user?.emailConfirmation.isConfirmed) {
            return
        }

        const newEmailConfirmation = {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                // minutes: 3,
                seconds: 30,
            }),
            isConfirmed: false
        }

        await usersRepository.updateConfirmationData(user!._id, newEmailConfirmation)

        const userData = await  usersRepository.findUserById(user!._id.toString());

        await emailAdapter.sendConfirmationEmail(userData!)
    },

    async sendConfirmation(id: string) {
        const user = await usersRepository.findUserById(id);

        if (!user) {
            return
        }

        await emailAdapter.sendConfirmationEmail(user)
    },

    async deleteUserById(id: string) {
        return await usersRepository.deleteUserById(id)
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)

        if (!user) {
            return null
        }

        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)

        if (user.accountData.passwordHash != passwordHash) {
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
    },
}