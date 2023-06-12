import {Request} from 'express'
import {LikeStatus, ResultCode, SortDirection} from "../utils/constants";


// ViewModels
export type VideoViewModel = {
    id: string
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: string[]
}
export type BlogViewModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type PostViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: LikeStatus
        newestLikes: {
            addedAt: string
            userId: string
            login: string
        } []
    }
}
export type UserViewModel = {
    id: string
    login: string
    email: string
    createdAt: string
}
export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
    likesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: LikeStatus
    }
}
export type DeviceViewModel = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}
export type PagingViewModel<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T
}

// DBModels
export type UserAccountDBModel = {
    id: string
    accountData: {
        login: string
        email: string
        passwordHash: string
        passwordSalt: string
        createdAt: string
    }
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
    recoveryCode: string | null
}
export type PostDBModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        statuses: {
            addedAt: string
            userId: string
            status: LikeStatus
            login: string
        } []
    }
}
export type CommentBDModel = {
    id: string
    postId: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
    likesInfo: {
        likesCount: number
        dislikesCount: number
        statuses: {
            // [key: string]: LikeStatus
            userId: string
            status: LikeStatus
        } []
    }
}
export type ExpiredTokenDBModel = {
    token: string
}
export type IPDBModel = {
    ip: string
    url: string
    date: Date
}
export type DeviceDBModel = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
    userId: string
}

// DTO
export type IdDTO = {
    id: string
}
export type PagingDTO = {
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortDirection?: SortDirection
}
export type PagingWithSearchDTO = {
    searchNameTerm: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}

export type VideoPostDTO = {
    title: string
    author: string
    availableResolutions: string[]
}
export type VideoPutDTO = {
    title: string
    author: string
    availableResolutions: string[]
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    publicationDate: string
}
export type BlogPostDTO = {
    title: string
    shortDescription: string
    content: string
}
export type BlogPutDTO = {
    name: string
    description: string
    websiteUrl: string
}
export type PostDTO = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}
export type UserGetDTO = {
    searchEmailTerm: string
    searchLoginTerm: string
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: 'asc' | 'desc'
}
export type UserRegDTO = {
    login: string
    password: string
    email: string
}
export type AuthDTO = {
    loginOrEmail: string
    password: string
}
export type PassCodeDTO = {
    recoveryCode: string
    newPassword: string
}

// ResBody - типизация ответа
// Locals - возможно переменные окружения
// e.Request<P,ResBody,ReqBody,ReqQuery,Locals>
//     <Params, ??????,   Body,   Query, ?????>

export type UserIdModel = {
    userId?: string |  null
}

export type ReqParamsType<T>         = Request<T>
export type ReqBodyType<T>           = Request<{},{},T>
export type ReqQueryType<T>          = Request<{},{},{},T>

export type ReqBodyQueryType<T, Y>        = Request<{},{},T,Y>
export type ReqParamsBodyType<T, Y>       = Request<T,{},Y>
export type ReqParamsQueryType<T, Y>      = Request<T,{},{},Y>
export type ReqParamsBodyQueryType<P,B,Q> = Request<P,{},B,Q>

export type Result<T> = {
    code: ResultCode
    data: T
}