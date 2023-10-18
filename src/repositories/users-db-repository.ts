import {NewUserType, QueryTypeViewUsers} from "../types/types";
import {dbCollectionBlog, dbCollectionUser} from "../db/db";
import {ObjectId} from "mongodb";

type Blog = {
    [key: string]: any
}

export const usersRepository = {
    async getAllUsers (defaultQuery: QueryTypeViewUsers) {
        const { sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm } = defaultQuery
        const skip = (pageNumber -1) * pageSize

        const sort: Blog = {}
        sort[sortBy] = sortDirection === 'desc'? -1: 1

        const query: any = {}
        if(searchLoginTerm) {
            return query.login = {$regex: searchLoginTerm, $options: 'i'}
        }
        if(searchEmailTerm) {
            return query.email = {$regex: searchEmailTerm, $options: 'i'}
        }

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
                id: user._id.toString(),
                login: user.userName,
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