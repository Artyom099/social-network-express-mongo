import {TBlog, TPost} from "../types";
import {blogCollection, postCollection} from "../db/db";

type PostOutputModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: [
        {
            id: string
            title: string
            shortDescription: string
            content: string
            blogId: string
            blogName: string
            createdAt: string
        }
    ]
}
type SortedBy<T> = {
    fieldName: keyof T
    direction: 'asc' | 'desc'
}

const getSortedItems = <T>(items: T[], sortBy: string, direction: string) => {
    return [...items].sort((u1, u2) => {
        if (u1.sortBy < u2[sortBy]) {
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

    async findPostsThisBlogById(blogId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string): Promise<PostOutputModel[]> {   // get
        const dbPosts: TPost[] = await postCollection.find({blogId: blogId}, {projection: {_id: false}}).toArray()

        const sortedPosts: TPost[] = getSortedItems(dbPosts, sortBy, sortDirection)
        // todo здесь сделать сортировку постов по параметру sortBy

        return {
            pagesCount: 1,
            page: 0,
            pageSize: pageSize,
            totalCount: 0,
            items: sortedPosts
        }

    }
}