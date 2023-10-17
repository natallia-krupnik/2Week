import {NewUserType, QueryTypeViewUsers} from "../types/types";
import {dbCollectionUser} from "../db/db";
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

        const totalCount = await dbCollectionUser.countDocuments()
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
        const user = await dbCollectionUser.findOne({_id: new ObjectId(id)})
        if (!user) {
            return null
        }
        return user
    },

    async findUserByLoginOrEmail(loginOrEmail: string){
        return await dbCollectionUser.findOne({$or: [{email: loginOrEmail}, {userName: loginOrEmail}]})
    },

    async deleteUserById(id: string) {
        if(!ObjectId.isValid(id)) return null

        const result = await dbCollectionUser.deleteOne({_id: new ObjectId(id)})

        if(result.deletedCount === 0){
            false
        }
        return true
    }
}