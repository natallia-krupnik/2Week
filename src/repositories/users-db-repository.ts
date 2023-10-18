import {NewUserType, QueryTypeViewUsers, UserInputType} from "../types/types";
import {dbCollectionBlog, dbCollectionUser} from "../db/db";
import {ObjectId} from "mongodb";

type Blog = {
    [key: string]: any
}

type QueryRegex = {
    $regex: string,
    $options: string
}

function prepareQuery ({ searchEmailTerm, searchLoginTerm }:QueryTypeViewUsers)  {

    const or: Partial<Record<keyof UserInputType, QueryRegex>>[] = []

    if(searchLoginTerm) {
        or.push({login: {$regex: searchLoginTerm, $options: 'i'}})
    }
    if(searchEmailTerm) {
        or.push({email: {$regex: searchEmailTerm, $options: 'i'} })
    }

    return or.length > 0 ? {$or: or} : {}
}

export const usersRepository = {
    async getAllUsers (defaultQuery: QueryTypeViewUsers) {
        const { sortBy, sortDirection, pageNumber, pageSize } = defaultQuery
        const skip = (pageNumber -1) * pageSize

        const sort: Blog = {}
        sort[sortBy] = sortDirection === 'desc'? -1: 1

        let query = prepareQuery(defaultQuery)

        console.log(query, 'query')

        const users = await dbCollectionUser
            .find(query)
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .toArray()

        const totalCount = await dbCollectionUser.countDocuments(query)
        const pagesCount = Math.ceil(totalCount/ pageSize)


        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: users.map(user => ({
                id: user.id.toString(),
                login: user.login,
                email: user.email,
                createdAt: user.createdAt
            }))
        }
    },

    async createUser(newUser: NewUserType){
        await dbCollectionUser.insertOne(newUser);
        return newUser
    },

    async findUserById(id: string) {
        const user = await dbCollectionUser.findOne({id: id})
        console.log(user, 'user')
        if (!user) {
            return null
        }
        return user
    },

    async findExistedEmail(value: string) {
        return await dbCollectionUser.findOne({email: value})

    },

    async findExistedLogin(value:string) {
        return await dbCollectionUser.findOne({login: value})

    },

    async findUserByLoginOrEmail(loginOrEmail: string){
        return await dbCollectionUser.findOne({$or: [{email: loginOrEmail}, {userName: loginOrEmail}]})
    },

    async deleteUserById(id: string) {
        //if(!ObjectId.isValid(id)) return null

        const result = await dbCollectionUser.deleteOne({id: id})

        if(result.deletedCount === 0){
            return false
        }
        return true
    },

    async deleteAllUsers() {
        const resul = await dbCollectionUser.deleteMany({})

        return resul.deletedCount > 0
    }
}