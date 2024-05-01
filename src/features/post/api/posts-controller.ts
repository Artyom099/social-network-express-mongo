import {
    IdDTO,
    PagingDTO,
    PostDTO,
    PostViewModel, ReqBodyQueryType,
    ReqBodyType, ReqParamsBodyQueryType, ReqParamsBodyType,
    UserIdModel,
} from "../../../types";
import {Request, Response} from "express";
import {PostsService} from "../application/posts-service";
import {HTTP_STATUS, LikeStatus, SortBy, SortDirection} from "../../../infrastructure/utils/enums";
import {CommentsService} from "../../comments/application/comments-service";
import {BlogsService} from "../../blog/application/blogs-service";
import {PostQueryRepository} from '../infrastructure/post.query.repository';
import {CommentsQueryRepository} from '../../comments/infrasrtucture/comments-query.repository';

export class PostsController {
    constructor(
      private postsService: PostsService,
      private blogsService: BlogsService,
      private feedbackService: CommentsService,
      private postQueryRepository: PostQueryRepository,
      private commentsQueryRepository: CommentsQueryRepository,
      ) {}

    async getPosts(req: ReqBodyQueryType<{userId: string}, PagingDTO>, res: Response) {
        const pageNumber = req.query.pageNumber ?? 1
        const pageSize = req.query.pageSize ?? 10
        const sortBy = req.query.sortBy ?? SortBy.default
        const sortDirection = req.query.sortDirection ?? SortDirection.default

        const posts = await this.postQueryRepository.getSortedPosts(req.body.userId, Number(pageNumber), Number(pageSize), sortBy, sortDirection)
        res.status(HTTP_STATUS.OK_200).json(posts)
    }

    async createPost(req: ReqBodyType<PostDTO>, res: Response) {
        const {title, shortDescription, content, blogId} = req.body

        const blog = await this.blogsService.getBlogById(blogId)

        const post = await this.postsService.createPost(title, shortDescription, content, blog)
        res.status(HTTP_STATUS.CREATED_201).json(post)
    }

    async getPost(req: Request, res: Response<PostViewModel>) {
        const post = await this.postsService.getPostById(req.params.id, req.body.userId)

        if (!post) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            res.status(HTTP_STATUS.OK_200).json(post)
        }
    }

    async updatePost(req: Request, res: Response) {
        const {title, shortDescription, content} = req.body

        const post = await this.postsService.updatePostById(req.params.id, title, shortDescription, content)

        if (!post) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            const updatedPost = await this.postsService.getPostById(req.params.id)
            res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedPost)
        }
    }

    async deletePost(req: Request, res: Response) {
        const post = await this.postsService.getPostById(req.params.id)

        if (!post) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            await this.postsService.deletePostById(req.params.id)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    }

    async findCommentsCurrentPost(req: ReqParamsBodyQueryType<IdDTO, UserIdModel, PagingDTO>, res: Response) {
        const post = await this.postsService.getPostById(req.params.id)

        if (!post) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            const currentUserId = req.body.userId
            const pageNumber = req.query.pageNumber ?? 1
            const pageSize = req.query.pageSize ?? 10
            const sortBy = req.query.sortBy ?? SortBy.default
            const sortDirection = req.query.sortDirection ?? SortDirection.default

            const comments = await this.commentsQueryRepository.getSortedCommentsCurrentPost(currentUserId!, post.id, Number(pageNumber), Number(pageSize), sortBy, sortDirection)
            res.status(HTTP_STATUS.OK_200).json(comments)
        }
    }

    async createCommentCurrentPost(req: Request, res: Response) {
        const post = await this.postsService.getPostById(req.params.id)

        if (!post) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            const comment = await this.feedbackService.createComment(req.params.id, req.body.content, req.user!.id, req.user!.login)
            res.status(HTTP_STATUS.CREATED_201).json(comment)
        }
    }

    async updateLikeStatus(req: ReqParamsBodyType<{id: string}, {likeStatus: LikeStatus}>, res: Response) {
        const post = await this.postsService.updatePostLikes(req.params.id, req.user!.id, req.body.likeStatus)

        if (!post) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    }
}