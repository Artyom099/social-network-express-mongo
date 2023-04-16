import {TBlog, TPost} from "../types";
import {blogCollection, postCollection} from "../db/db";

type PostOutputModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: TPost[]
}

const getSortedItems = (items: TPost[], sortBy: string, direction: string): TPost[] => {
    return [...items].sort((u1, u2) => {
        if (u1[sortBy] < u2[sortBy]) {
            return direction === 'asc' ? -1 : 1
        }
        if (u1[sortBy] > u2[sortBy]) {
            return direction === 'desc' ? 1 : -1
        }
        return 0
    })
}

export const queryRepository = {
    async findBlogById(blogId: string): Promise<TBlog | null> {    // get, put, delete
        const blog = await blogCollection.findOne({id: blogId}, {projection: {_id: false}})
        if (blog) return blog
        else return null
    },

    async findPostsThisBlogById(blogId: string, pageNumber: number, pageSize: number, sortBy: string,
                                sortDirection: string): Promise<PostOutputModel> {   // get
        const dbPosts: TPost[] = await postCollection.find({blogId: blogId}, {projection: {_id: false}}).toArray()
        const totalCount: number = await postCollection.countDocuments({blogId: blogId})

        const sortedPosts: TPost[] = getSortedItems(dbPosts, sortBy, sortDirection)     // todo - сортировка постов по параметру sortBy

        return {
            pagesCount: pageNumber,     // общее количество страниц?
            page: 1,                    // текущая страница?
            pageSize,                   // количество постов на странице
            totalCount,                 // общее количество постов?
            items: sortedPosts
        }
    }
}