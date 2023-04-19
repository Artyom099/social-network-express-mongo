import {Request} from 'express'
import {ObjectId} from "mongodb";

export type IdDTO = {
    id: string
}

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

export type BlogPostsGetDTO = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
}

export type BlogGetWithSearchDTO = {
    searchNameTerm: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
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

export type UserGetDTO = {
    searchEmailTerm: string
    searchLoginTerm: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
}
export type UserDBType = {
    id: object
    userName: string
    email: string
    passwordHash: string
    passwordSalt: string
    createdAt: string
}

export type AuthType = {
    loginOrEmail: string
    password: string
}

export type PostDTO = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

// e.Request<P,ResBody,ReqBody,ReqQuery,Locals>
//     <Params, ??????,   Body,   Query, ?????>
7
export type ReqParamsType<T> = Request<T>
export type ReqBodyType<T>   = Request<{},{},T>
export type ReqQueryType<T>  = Request<{},{},{},T>
export type ReqParamsBodyType<T, Y> = Request<T,{},Y>
export type ReqParamsQueryType<T, Y> = Request<T,{},{},Y>

export type OutputModel<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T
}