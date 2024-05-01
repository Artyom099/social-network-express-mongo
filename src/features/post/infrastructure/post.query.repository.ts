import {PagingViewModel, PostDBModel, PostViewModel} from '../../../types';
import {PostModel} from './posts-schema';
import {LikeStatus} from '../../../infrastructure/utils/enums';

export class PostQueryRepository {
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
          newestLikes: newestLikes.sort((a, b) => a.addedAt - b.addedAt).slice(-3).reverse()
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
  }

  async getSortedPostsCurrentBlog(currentUserId: string | null, blogId: string, pageNumber: number, pageSize: number, sortBy: string,
                                  sortDirection: 'asc'|'desc'): Promise<PagingViewModel<PostViewModel[]>> {

    const filter: {blogId: string} = {blogId}

    const totalCount: number = await PostModel.countDocuments(filter)

    const sortedPosts: PostDBModel[] = await PostModel
      .find(filter)
      .sort({[sortBy]: sortDirection})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean()

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
          newestLikes: newestLikes.sort((a, b) => a.addedAt - b.addedAt).slice(-3).reverse()
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
  }
}