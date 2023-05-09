import {Request} from 'express'
import {ResultCode} from "./constants";


// ViewModels
export type TVideo = {
    id: string
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: string[]
}
export type TBlog = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type TPost = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type TUser = {
    id: string
    login: string
    email: string
    createdAt: string
}
export type TComment = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
}

export type UserAccountDBType = {
    id: string
    accountData: {
        login: string
        email: string
        passwordHash: string
        passwordSalt: string
        createdAt: string
    },
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
}
export type CommentBDType = {
    id: string
    postId: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
}

export type IdDTO = {
    id: string
}
export type PagingDTO = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: 'asc' | 'desc'
}
export type PagingWithSearchDTO = {
    searchNameTerm: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
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

// ResBody - типизация ответа
// Locals - возможно переменные окружения
// e.Request<P,ResBody,ReqBody,ReqQuery,Locals>
//     <Params, ??????,   Body,   Query, ?????>

export type ReqParamsType<T>         = Request<T>
export type ReqBodyType<T>           = Request<{},{},T>
export type ReqQueryType<T>          = Request<{},{},{},T>
export type ReqParamsBodyType<T, Y>  = Request<T,{},Y>
export type ReqParamsQueryType<T, Y> = Request<T,{},{},Y>

export type OutputModel<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T
}
export type Result<T> = {
    code: ResultCode
    data: T
}