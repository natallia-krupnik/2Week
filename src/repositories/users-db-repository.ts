import {EmailConfirmation, NewAuthUserType, NewUserType, QueryTypeViewUsers, UserInputType} from "../types/types";
import {dbCollectionBlog, dbCollectionUser} from "../db/db";
import {ObjectId} from "mongodb";
import {usersService} from "../domain (business layer)/users-service";

type Blog = {
    [key: string]: any
}

type QueryRegex = {
    $regex: string,
    $options: string
}

function prepareQuery({searchEmailTerm, searchLoginTerm}: QueryTypeViewUsers) {

    const or: Partial<Record<keyof UserInputType, QueryRegex>>[] = []

    if (searchLoginTerm) {
        or.push({login: {$regex: searchLoginTerm, $options: 'i'}})
    }
    if (searchEmailTerm) {
        or.push({email: {$regex: searchEmailTerm, $options: 'i'}})
    }

    return or.length > 0 ? {$or: or} : {}
}

export const usersRepository = {
    async getAllUsers(defaultQuery: QueryTypeViewUsers) {
        const {sortBy, sortDirection, pageNumber, pageSize} = defaultQuery
        const skip = (pageNumber - 1) * pageSize

        const sort: Blog = {}
        sort[sortBy] = sortDirection === 'desc' ? -1 : 1

        let query = prepareQuery(defaultQuery)

        console.log(query, 'query')

        const users = await dbCollectionUser
            .find(query)
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .toArray()

        const totalCount = await dbCollectionUser.countDocuments(query)
        const pagesCount = Math.ceil(totalCount / pageSize)


        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: users.map(user => ({
                id: user._id.toString(),
                login: user.accountData.login,
                email: user.accountData.email,
                createdAt: user.accountData.createdAt
            }))
        }
    },

    async updateConfirmationData(id: ObjectId, confirmation: EmailConfirmation) {
        return await dbCollectionUser.findOneAndUpdate({_id: id}, {
            $set: {
                'emailConfirmation.confirmationCode': confirmation.confirmationCode,
                'emailConfirmation.isConfirmed': confirmation.isConfirmed,
                'emailConfirmation.expirationDate': confirmation.expirationDate
            }
        });
    },

    async createUser(newUser: NewAuthUserType) {
        return await dbCollectionUser.insertOne(newUser);
    },// тут возвраш только id созданного элемента

    async findUserById(id: string) {
        const user = await dbCollectionUser.findOne({_id: new ObjectId(id)})

        if (!user) {
            return null
        }
        return user
    },

    async findExistedEmail(value: string) {
        return await dbCollectionUser.findOne({email: value})

    },

    async findExistedLogin(value: string) {
        return await dbCollectionUser.findOne({login: value})

    },

    async findUserByLoginOrEmail(loginOrEmail: string) {
        return await dbCollectionUser.findOne({
            $or: [
                {email: loginOrEmail},
                {login: loginOrEmail}
            ]
        })
    },

    async deleteUserById(id: string) {

        const result = await dbCollectionUser.deleteOne({_id: new ObjectId(id)})

        if (result.deletedCount === 0) {
            return false
        }
        return true
    },

    async deleteAllUsers() {
        const resul = await dbCollectionUser.deleteMany({})

        return resul.deletedCount > 0
    },

    async findUserByConfirmationCode(emailConfirmation: string) {
        return await dbCollectionUser.findOne({'emailConfirmation.confirmationCode': emailConfirmation})
    },

    async updateConfirmation(_id: ObjectId) {
        const result = await dbCollectionUser.updateOne
        ({_id},
            {
                $set: {'emailConfirmation.isConfirmed': true}
            })
        return result.modifiedCount === 1
    }
}