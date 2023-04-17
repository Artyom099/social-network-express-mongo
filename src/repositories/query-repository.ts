import {TBlog, TPost} from "../types";
import {blogCollection, postCollection} from "../db/db";
import {Sort} from "mongodb";

type OutputModel<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T
}


// @ts-ignore
const directionToNum = (sortDirection: string): Sort => {
    if (!sortDirection || sortDirection === 'desc') return -1
    if (sortDirection === 'asc') return 1
}

export const queryRepository = {
    async findBlogById(blogId: string): Promise<TBlog | null> {    // get, put, delete
        const blog = await blogCollection.findOne({id: blogId}, {projection: {_id: false}})
        if (blog) return blog
        else return null
    },

    async findBlogsAndSort(searchNameTerm: string, pageNumber: number, pageSize: number, sortBy: string,
                          sortDirection: string): Promise<OutputModel<TBlog[]>> {
        let sortNum: Sort = -1
        if (sortDirection === 'asc') sortNum = 1
        if (sortDirection === 'desc') sortNum = -1
        // const sortNum: Sort = directionToNum(sortDirection) ?? -1

        const totalCount: number = await blogCollection.countDocuments({name: { $regex: searchNameTerm}})
        const sortedBlogs: TBlog[] = await blogCollection.find({name: { $regex: searchNameTerm}},
            {projection: {_id: false}}).sort({sortBy: sortNum}).toArray()
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
        const filter: {blogId: string} = {blogId: blogId}
        let sortNum: Sort = -1
        if (!sortDirection || sortDirection === 'desc') sortNum = -1
        if (sortDirection === 'asc') sortNum = 1

        const totalCount: number = await postCollection.countDocuments(filter)
        const sortedPosts: TPost[] = await postCollection.find(filter, {projection: {_id: false}})
            .sort({sortBy: sortNum}).toArray()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество постов на странице
            totalCount,                                         // общее количество постов
            items: sortedPosts
        }
    }
}