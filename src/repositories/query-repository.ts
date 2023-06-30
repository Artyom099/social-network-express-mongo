import {
    PagingViewModel,
    BlogViewModel,
    CommentViewModel,
    PostViewModel,
    UserAccountDBModel,
    CommentBDModel, PostDBModel
} from "../types/types"
import {userCollection} from "../db/db";
import {Filter} from "mongodb"
import {BlogModel} from "../shemas/blogs-schema";
import {PostModel} from "../shemas/posts-schema";
import {CommentModel} from "../shemas/feedback-schema";
import {LikeStatus} from "../utils/constants";


export const queryRepository = {
    async getSortedBlogs(searchNameTerm: string | null, pageNumber: number, pageSize: number, sortBy: string,
                         sortDirection: 'asc'|'desc'): Promise<PagingViewModel<BlogViewModel[]>> {
        const filter = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {}
        const totalCount: number = await BlogModel.countDocuments(filter)
        const sortedBlogs: BlogViewModel[] = await BlogModel.find(filter,{ _id: 0, __v: 0 })
            .sort({[sortBy]: sortDirection}).skip((pageNumber - 1) * pageSize).limit(pageSize)
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество блогов на странице
            totalCount,                                         // общее количество блогов
            items: sortedBlogs
        }
    },

    async getSortedPostsCurrentBlog(currentUserId: string | null, blogId: string, pageNumber: number, pageSize: number, sortBy: string,
                                    sortDirection: 'asc'|'desc'): Promise<PagingViewModel<PostViewModel[]>> {
        const filter: {blogId: string} = {blogId}
        const totalCount: number = await PostModel.countDocuments(filter)
        const sortedPosts: PostDBModel[] = await PostModel.find(filter).sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize).limit(pageSize).lean()

        const items = sortedPosts.map(p => {
            let myStatus = LikeStatus.None
            let likesCount = 0
            let dislikesCount = 0
            let newestLikes: any[] = []
            p.extendedLikesInfo.statuses.forEach(p => {
                if (p.userId === currentUserId) myStatus = p.status
                if (p.status === LikeStatus.Like) {
                    likesCount++
                    newestLikes.push({addedAt: p.addedAt, userId: p.userId, login: p.login})
                }
                if (p.status === LikeStatus.Dislike) dislikesCount++
            })
            return {
                id: p.id,
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogId: p.blogId,
                blogName: p.blogName,
                createdAt: p.createdAt,
                extendedLikesInfo: {
                    likesCount,
                    dislikesCount,
                    myStatus,
                    newestLikes: newestLikes.slice(-3)
                }
            }
        })
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество постов на странице
            totalCount,                                         // общее количество постов
            items                                               // выводить pageSize постов на pageNumber странице
        }
    },

    async getSortedPosts(currentUserId: string | null, pageNumber: number, pageSize: number, sortBy: string,
                         sortDirection: 'asc'|'desc'): Promise<PagingViewModel<PostViewModel[]>> {
        const totalCount: number = await PostModel.countDocuments()
        const sortedPosts: PostDBModel[] = await PostModel.find().sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize).limit(pageSize).lean()

        const items = sortedPosts.map(p => {
            let myStatus = LikeStatus.None
            let likesCount = 0
            let dislikesCount = 0
            let newestLikes: any[] = []
            p.extendedLikesInfo.statuses.forEach(p => {
                if (p.userId === currentUserId) myStatus = p.status
                if (p.status === LikeStatus.Like) {
                    likesCount++
                    newestLikes.push({addedAt: p.addedAt, userId: p.userId, login: p.login})
                }
                if (p.status === LikeStatus.Dislike) dislikesCount++
            })
            return {
                id: p.id,
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogId: p.blogId,
                blogName: p.blogName,
                createdAt: p.createdAt,
                extendedLikesInfo: {
                    likesCount,
                    dislikesCount,
                    myStatus,
                    newestLikes: newestLikes.sort((a, b) => b.addedAt - a.addedAt).slice(-3)
                }
            }
        })
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество постов на странице
            totalCount,                                         // общее количество постов
            items                                               // выводить pageSize постов на pageNumber странице
        }
    },

    async getSortedUsers(searchEmailTerm: string | null, searchLoginTerm: string | null, pageNumber: number, pageSize: number,
                         sortBy: string, sortDirection: 'asc'|'desc'): Promise<PagingViewModel<UserAccountDBModel[]>> {
        const filter: Filter<UserAccountDBModel> = { $or: [
            { 'accountData.login': {$regex: searchLoginTerm ?? '', $options: "i"} },
            { 'accountData.email': {$regex: searchEmailTerm ?? '', $options: "i"} }
        ]}
        const totalCount: number = await userCollection.countDocuments(filter)
        const sortedUsers: UserAccountDBModel[] = await userCollection
            .find(filter, {projection: {_id: 0, id: 1, login: '$accountData.login', email: '$accountData.email', createdAt: '$accountData.createdAt'}})
            .sort({[sortBy]: sortDirection}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество пользователей на странице
            totalCount,                                         // общее количество пользователей
            items: sortedUsers  //todo здесь тип TUser!
        }
    },

    async getSortedCommentsCurrentPost(currentUserId: string | null, postId: string, pageNumber: number, pageSize: number, sortBy: string,
                                       sortDirection: 'asc'|'desc'): Promise<PagingViewModel<CommentViewModel[]>> {
        const filter: {postId: string} = { postId }
        const totalCount: number = await CommentModel.countDocuments(filter)
        let sortedComments: CommentBDModel[] = await CommentModel.find(filter).sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize).limit(pageSize).lean()

        const items = sortedComments.map(c => {
            let myStatus = LikeStatus.None
            let likesCount = 0
            let dislikesCount = 0
            c.likesInfo.statuses.forEach(s => {
                if (s.userId === currentUserId) myStatus = s.status
                if (s.status === LikeStatus.Like) likesCount++
                if (s.status === LikeStatus.Dislike) dislikesCount++
            })
            return {
                id: c.id,
                content: c.content,
                commentatorInfo: {
                    userId: c.commentatorInfo.userId,
                    userLogin: c.commentatorInfo.userLogin
                },
                createdAt: c.createdAt,
                likesInfo: {
                    likesCount,
                    dislikesCount,
                    myStatus
                }
            }
        })
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество комментариев на странице
            totalCount,                                         // общее количество комментариев
            items
        }
    }
}