import {IdDTO, PagingDTO, PostDTO, PostViewModel, ReqBodyType, ReqParamsQueryType, ReqQueryType} from "../types/types";
import {Request, Response} from "express";
import {PostsService} from "../domain/posts-service";
import {HTTP_STATUS, SortBy, SortDirection} from "../utils/constants";
import {queryRepository} from "../repositories/query-repository";
import {FeedbackService} from "../domain/feedbacks-service";
import {FeedbackRepository} from "../repositories/feedback-repository";
import {BlogsService} from "../domain/blogs-service";
import {BlogsRepository} from "../repositories/blogs-repository";


export class PostsController {
    constructor(protected postsService: PostsService) {}

    async getPosts(req: ReqQueryType<PagingDTO>, res: Response) {
        const pageNumber = req.query.pageNumber ?? 1
        const pageSize = req.query.pageSize ?? 10
        const sortBy = req.query.sortBy ?? SortBy.default
        const sortDirection = req.query.sortDirection ?? SortDirection.default
        const foundSortedPosts = await queryRepository.findPostsAndSort(Number(pageNumber), Number(pageSize), sortBy, sortDirection)
        res.status(HTTP_STATUS.OK_200).json(foundSortedPosts)
    }
    async createPost(req: ReqBodyType<PostDTO>, res: Response) {
        const {title, shortDescription, content, blogId} = req.body

        const blog = new BlogsService(new BlogsRepository)
        const foundBLog = await blog.findBlogById(blogId)

        const createdPost = await this.postsService.createPost(title, shortDescription, content, foundBLog)
        res.status(HTTP_STATUS.CREATED_201).json(createdPost)
    }

    async getPost(req: Request, res: Response<PostViewModel>) {
        const foundPost = await this.postsService.findPostById(req.params.id)
        if (!foundPost) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            res.status(HTTP_STATUS.OK_200).json(foundPost)
        }
    }
    async updatePost(req: Request, res: Response) {
        const {title, shortDescription, content} = req.body
        const foundPost = await this.postsService.updatePostById(req.params.id, title, shortDescription, content)
        if (!foundPost) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            const updatedPost = await this.postsService.findPostById(req.params.id)
            res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedPost)
        }
    }
    async deletePost(req: Request, res: Response) {
        const foundPost = await this.postsService.findPostById(req.params.id)
            if (!foundPost) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            await this.postsService.deletePostById(req.params.id)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    }

    async findCommentsCurrentPost(req: ReqParamsQueryType<IdDTO, PagingDTO>, res: Response) {
        //todo - middleware для нахождения userId
        const foundPost = await this.postsService.findPostById(req.params.id)
        if (!foundPost) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            const pageNumber = req.query.pageNumber ?? 1
            const pageSize = req.query.pageSize ?? 10
            const sortBy = req.query.sortBy ?? SortBy.default
            const sortDirection = req.query.sortDirection ?? SortDirection.default
            const foundSortedComments = await queryRepository.findCommentsThisPostAndSort(foundPost.id, Number(pageNumber), Number(pageSize), sortBy, sortDirection)
            res.status(HTTP_STATUS.OK_200).json(foundSortedComments)
        }
    }
    async createCommentCurrentPost(req: Request, res: Response) {
        const currentPost = await this.postsService.findPostById(req.params.postId)
        if (!currentPost) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            const comment = new FeedbackService(new FeedbackRepository)
            const createdComment = await comment.createComment(req.params.postId, req.body.content, req.user!.id, req.user!.login)
            res.status(HTTP_STATUS.CREATED_201).json(createdComment)
        }
    }
}