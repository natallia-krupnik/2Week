import {
    ExtendsQueryParamsInput,
    QueryParamsBlogsInput,
    QueryParamsInput,
    QueryTypeView,
    QueryTypeViewBlogs, QueryTypeViewUsers
} from "../../types/types";

export const sortQueryParams = (query: QueryParamsInput): QueryTypeView =>{
    const defaultResult = {
        sortBy: 'createdAt',
        sortDirection: 'desc',
        pageSize: 10,
        pageNumber: 1
    }
    if(query.sortBy) defaultResult.sortBy = query.sortBy

    if(query.sortDirection) defaultResult.sortDirection = query.sortDirection

    if(query.pageSize) {
        defaultResult.pageSize = parseInt(query.pageSize)
    }

    if(query.pageNumber) {
        defaultResult.pageNumber = parseInt(query.pageNumber)
    }

    return defaultResult
}

export const sortQueryParamsBlogs = (query: QueryParamsBlogsInput): QueryTypeViewBlogs =>{
    const defaultResult: QueryTypeViewBlogs  = {
        searchNameTerm: null,
        sortBy: 'createdAt',
        sortDirection: 'desc',
        pageSize: 10,
        pageNumber: 1
    }

    if(query.searchNameTerm){
        defaultResult.searchNameTerm = query.searchNameTerm
    }

    if(query.sortBy) defaultResult.sortBy = query.sortBy

    if(query.sortDirection) defaultResult.sortDirection = query.sortDirection

    if(query.pageSize) {
        defaultResult.pageSize = parseInt(query.pageSize)
    }

    if(query.pageNumber) {
        defaultResult.pageNumber = parseInt(query.pageNumber)
    }

    return defaultResult
}

export  const sortQueryParamsUsers = (query: ExtendsQueryParamsInput): QueryTypeViewUsers => {
    const defaultResult: QueryTypeViewUsers = {
        sortBy: 'createdAt',
        sortDirection: 'desc',
        pageSize: 10,
        pageNumber: 1,
    }

    if(query.sortBy) {
        defaultResult.sortBy = query.sortBy
    }

    if(query.sortDirection) {
        defaultResult.sortDirection = query.sortDirection
    }

    if(query.pageSize) {
        defaultResult.pageSize = parseInt(query.pageSize)
    }

    if(query.pageNumber) {
        defaultResult.pageNumber = parseInt(query.pageNumber)
    }

    if (query.searchEmailTerm) {
        defaultResult.searchEmailTerm = query.searchEmailTerm
    }

    if(query.searchLoginTerm) {
        defaultResult.searchLoginTerm = query.searchLoginTerm
    }

    return defaultResult
}
