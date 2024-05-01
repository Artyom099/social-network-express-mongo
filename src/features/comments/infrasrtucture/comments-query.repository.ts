import {
  CommentBDModel,
  CommentViewModel,
  PagingViewModel,
} from '../../../types';
import {LikeStatus} from '../../../infrastructure/utils/enums';
import {CommentModel} from './comments-schema';

export class CommentsQueryRepository {
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