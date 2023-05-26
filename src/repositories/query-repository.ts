import {OutputModel, TBlog, TComment, TPost, UserAccountDBType} from "../types/types"
import {BlogModel, commentCollection, postCollection, userCollection} from "../db/db";
import {Filter} from "mongodb"


export const queryRepository = {
    async findBlogsAndSort(searchNameTerm: string | null, pageNumber: number, pageSize: number, sortBy: string,
                           sortDirection: 'asc' | 'desc'): Promise<OutputModel<TBlog[]>> {
        const filter = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {}

        const totalCount: number = await BlogModel.countDocuments(filter)
        const sortedBlogs: TBlog[] = await BlogModel.find(filter,{ _id: 0, __v: 0 })
            .sort({[sortBy]: sortDirection}).skip((pageNumber - 1) * pageSize).limit(pageSize)
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество блогов на странице
            totalCount,                                         // общее количество блогов
            items: sortedBlogs
        }
    },

    async findPostsThisBlogById(blogId: string, pageNumber: number, pageSize: number, sortBy: string,
                                sortDirection: 'asc' | 'desc'): Promise<OutputModel<TPost[]>> {   // get
        const filter: {blogId: string} = {blogId: blogId}

        const totalCount: number = await postCollection.countDocuments(filter)
        const sortedPosts: TPost[] = await postCollection.find(filter, {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество постов на странице
            totalCount,                                         // общее количество постов
            items: sortedPosts          // выводить pageSize постов на pageNumber странице
        }
    },

    async findPostsAndSort(pageNumber: number, pageSize: number, sortBy: string,
                           sortDirection: 'asc' | 'desc'): Promise<OutputModel<TPost[]>> {
        const totalCount: number = await postCollection.countDocuments()
        const sortedPosts: TPost[] = await postCollection.find({}, {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество постов на странице
            totalCount,                                         // общее количество постов
            items: sortedPosts          // выводить pageSize постов на pageNumber странице
        }
    },

    async findUsersAndSort(searchEmailTerm: string | null, searchLoginTerm: string | null, pageNumber: number, pageSize: number, sortBy: string,
                           sortDirection: 'asc' | 'desc'): Promise<OutputModel<UserAccountDBType[]>> {
        const filter: Filter<UserAccountDBType> = {
            $or: [{'accountData.login': {$regex: searchLoginTerm ?? '', $options: "i"}},
                {'accountData.email': {$regex: searchEmailTerm ?? '', $options: "i"}}]
        }
        const totalCount: number = await userCollection.countDocuments(filter)
        const sortedUsers: UserAccountDBType[] = await userCollection
            .find(filter, {projection: {_id: 0, id: 1, login: '$accountData.login',
                email: '$accountData.email', createdAt: '$accountData.createdAt'}})
            .sort({[sortBy]: sortDirection}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество пользователей на странице
            totalCount,                                         // общее количество пользователей
            items: sortedUsers  //todo здесь тип TUser!
        }
    },

    async findCommentsThisPostAndSort(postId: string, pageNumber: number, pageSize: number, sortBy: string,
                                      sortDirection: 'asc' | 'desc'): Promise<OutputModel<TComment[]>> {
        const filter: {postId: string} = {postId: postId}
        const totalCount: number = await commentCollection.countDocuments(filter)
        const sortedComments: TComment[] = await commentCollection.find(filter, {projection: {_id: 0, postId: 0}})
            .sort({[sortBy]: sortDirection}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество комментариев на странице
            totalCount,                                         // общее количество комментариев
            items: sortedComments
        }
    }
}