import {OutputModel, TBlog, TComment, TPost, TUser} from "../types"
import {blogCollection, commentCollection, postCollection, userCollection} from "../db/db";
import {Filter, Sort} from "mongodb"

// @ts-ignore TODO заменить этой функцией sortNum
const sortDirToNum = (sortDirection: string = -1): Sort => {
    if (sortDirection === 'desc') return -1
    if (sortDirection === 'asc') return 1
}


export const queryRepository = {
    async findBlogById(blogId: string): Promise<TBlog | null> {    // get, put, delete
        const blog = await blogCollection.findOne({id: blogId}, {projection: {_id: false}})
        if (blog) return blog
        else return null
    },

    async findBlogsAndSort(searchNameTerm: string | null, pageNumber: number, pageSize: number, sortBy: string,
                           sortDirection: string): Promise<OutputModel<TBlog[]>> {
        let sortNum: Sort = -1
        if (sortDirection === 'asc') sortNum = 1     // 1 - возрстание
        if (sortDirection === 'desc') sortNum = -1   // -1 - убывание

        const filter: Filter<TBlog> = {}
        if (searchNameTerm) filter.name = {$regex: searchNameTerm, $options: "i"}

        const totalCount: number = await blogCollection.countDocuments(filter)
        const sortedBlogs: TBlog[] = await blogCollection.find(filter, {projection: {_id: false}})
            .sort({[sortBy]: sortNum}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество блогов на странице
            totalCount,                                         // общее количество блогов
            items: sortedBlogs
        }
    },

    async findPostsThisBlogById(blogId: string, pageNumber: number, pageSize: number, sortBy: string,
                                sortDirection: string): Promise<OutputModel<TPost[]>> {   // get
        const filter: { blogId: string } = {blogId: blogId}
        let sortNum: Sort = -1
        if (sortDirection === 'asc') sortNum = 1
        if (sortDirection === 'desc') sortNum = -1

        const totalCount: number = await postCollection.countDocuments(filter)
        const sortedPosts: TPost[] = await postCollection.find(filter, {projection: {_id: false}})
            .sort({[sortBy]: sortNum}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество постов на странице
            totalCount,                                         // общее количество постов
            items: sortedPosts          // выводить pageSize постов на pageNumber странице
        }
    },

    async findPostsAndSort(pageNumber: number, pageSize: number, sortBy: string,
                           sortDirection: string): Promise<OutputModel<TPost[]>> {
        let sortNum: Sort = -1
        if (sortDirection === 'asc') sortNum = 1
        if (sortDirection === 'desc') sortNum = -1

        const totalCount: number = await postCollection.countDocuments()
        const sortedPosts: TPost[] = await postCollection.find({}, {projection: {_id: false}})
            .sort({[sortBy]: sortNum}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество постов на странице
            totalCount,                                         // общее количество постов
            items: sortedPosts          // выводить pageSize постов на pageNumber странице
        }
    },

    async findUsersAndSort(searchEmailTerm: string | null, searchLoginTerm: string | null, pageNumber: number, pageSize: number, sortBy: string,
                           sortDirection: string): Promise<OutputModel<TUser[]>> {
        let sortNum: Sort = -1
        if (sortDirection === 'asc') sortNum = 1     // 1 - возрстание
        if (sortDirection === 'desc') sortNum = -1   // -1 - убывание

        const filter: Filter<TUser> = {
            $or: [{login: {$regex: searchLoginTerm ?? '', $options: "i"}},
                {email: {$regex: searchEmailTerm ?? '', $options: "i"}}]
        }
        const totalCount: number = await userCollection.countDocuments(filter)
        const sortedUsers: TUser[] = await userCollection.find(filter, {projection: {_id: false, passwordHash: false, passwordSalt: false}})
            .sort({[sortBy]: sortNum}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество пользователей на странице
            totalCount,                                         // общее количество пользователей
            items: sortedUsers
        }
    },

    async findCommentsAndSort(postId: string, pageNumber: number, pageSize: number, sortBy: string,
                              sortDirection: string): Promise<OutputModel<TComment[]>> {
        let sortNum: Sort = -1
        if (sortDirection === 'asc') sortNum = 1     // 1 - возрстание
        if (sortDirection === 'desc') sortNum = -1   // -1 - убывание

        const totalCount: number = await commentCollection.countDocuments()
        const sortedComments: TComment[] = await commentCollection.find({}, {projection: {_id: false}})
            .sort({[sortBy]: sortNum}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество пользователей на странице
            totalCount,                                         // общее количество пользователей
            items: sortedComments
        }
    }
}