
import {CommitQuery, CommitViewQueryParams} from "../../types/comments/comments";
import {QueryType} from "../../types/types";

export  const sortQueryParamsComments = (query: CommitViewQueryParams): CommitQuery => {
    const defaultResult: QueryType = {
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

    return defaultResult
}
