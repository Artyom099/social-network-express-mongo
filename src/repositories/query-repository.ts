import {TBlog, TPost} from "../types";
import {blogCollection, postCollection} from "../db/db";

type PostOutputModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: TPost[]
}

// const getSortedItems = (items: TPost[], sortBy: string, direction: string): TPost[] => {
//     return [...items].sort((u1, u2) => {
//         if (u1[sortBy] < u2[sortBy]) {
//             return direction === 'asc' ? -1 : 1
//         }
//         if (u1[sortBy] > u2[sortBy]) {
//             return direction === 'desc' ? 1 : -1
//         }
//         return 0
//     })
// }
// const obj = {[sortBy]: ''}
// obj[sortBy] = 6

export const queryRepository = {
    async findBlogById(blogId: string): Promise<TBlog | null> {    // get, put, delete
        const blog = await blogCollection.findOne({id: blogId}, {projection: {_id: false}})
        if (blog) return blog
        else return null
    },

    async findBlogAndSort(searchNameTerm: string, pageNumber: number, pageSize: number, sortBy: string,
                          sortDirection: string) {
        const filter: {blogId: string, searchNameTerm?: string} = {blogId: blogId}

        // if(searchNameTerm) {
        //     filter.searchNameTerm = {}
        // }

        const totalCount: number = await blogCollection.countDocuments({searchNameTerm})
        const sortedBlogs: TBlog[] = await blogCollection.find({}, {projection: {_id: false}}).toArray()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество блогов на странице
            totalCount,                                         // общее количество блогов
            items: sortedBlogs
        }
    },

    async findPostsThisBlogById(blogId: string, pageNumber: number, pageSize: number, sortBy: string,
                                sortDirection: string): Promise<PostOutputModel> {   // get

        const filter: {blogId: string, searchNameTerm?: string} = {blogId: blogId}

        let sortDir
        if (sortDirection === 'asc') sortDir = '1'
        if (sortDirection === 'desc') sortDir = '-1'

        const totalCount: number = await postCollection.countDocuments(filter)
        const sortedPosts: TPost[] = await postCollection.find(filter, {projection: {_id: false}})
            .sort({sortBy: sortDir}).toArray()

        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество постов на странице
            totalCount,                                         // общее количество постов
            items: sortedPosts
        }
    }
}