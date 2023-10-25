import { ExtendsQueryParamsInput, QueryTypeViewUsers } from "../../types/types";

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
