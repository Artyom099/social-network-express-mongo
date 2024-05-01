import {BlogsService} from "../application/blogs-service";
import {
    BlogCreateDTO, BlogUpdateDTO, BlogViewModel,
    IdDTO,
    PagingDTO,
    PagingWithSearchDTO, ReqParamsBodyQueryType,
    ReqParamsBodyType,
    ReqQueryType, UserIdModel
} from "../../../types";
import {Request, Response} from "express";
import {HTTP_STATUS, SortBy, SortDirection} from "../../../infrastructure/utils/enums";
import {PostsService} from "../../post/application/posts-service";
import {BlogQueryRepository} from '../infrastructure/blog.query.repository';
import {PostQueryRepository} from '../../post/infrastructure/post.query.repository';


export class BlogsController {
    constructor(
      private blogsService: BlogsService,
      private postsService: PostsService,
      private blogQueryRepository: BlogQueryRepository,
      private postQueryRepository: PostQueryRepository,
    ) {}

    async getBlogs(req: ReqQueryType<PagingWithSearchDTO>, res: Response) {
        const searchNameTerm = req.query.searchNameTerm ?? null
        const pageNumber = req.query.pageNumber ?? 1
        const pageSize = req.query.pageSize ?? 10
        const sortBy = req.query.sortBy ?? SortBy.default
        const sortDirection = req.query.sortDirection ?? SortDirection.default

        const blogs = await this.blogQueryRepository.getSortedBlogs(searchNameTerm, Number(pageNumber), Number(pageSize), sortBy, sortDirection)
        res.status(HTTP_STATUS.OK_200).json(blogs)
    }

    async createBlog(req: Request, res: Response) {
        const {name, description, websiteUrl} = req.body

        const blog = await this.blogsService.createBlog(name, description, websiteUrl)

        res.status(HTTP_STATUS.CREATED_201).json(blog)
    }

    async getBlog(req: Request, res: Response<BlogViewModel>) {
        const blog = await this.blogsService.getBlogById(req.params.id)

        if (!blog) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }  else {
            res.status(HTTP_STATUS.OK_200).json(blog)
        }
    }

    async updateBlog(req: ReqParamsBodyType<IdDTO, BlogUpdateDTO>, res: Response) {
        const {name, description, websiteUrl} = req.body

        const result = await this.blogsService.updateBlogById(req.params.id, name, description, websiteUrl)

        if (!result) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            const blog = await this.blogsService.getBlogById(req.params.id)
            res.status(HTTP_STATUS.NO_CONTENT_204).json(blog)
        }
    }

    async deleteBlog(req: Request, res: Response) {
        const blog = await this.blogsService.getBlogById(req.params.id)

        if (!blog) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            await this.blogsService.deleteBlogById(req.params.id)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    }

    async getPostCurrentBlog(req: ReqParamsBodyQueryType<IdDTO, UserIdModel, PagingDTO>, res: Response) {
        const blog = await this.blogsService.getBlogById(req.params.id)

        if (!blog) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            const pageNumber = req.query.pageNumber ?? 1
            const pageSize = req.query.pageSize ?? 10
            const sortBy = req.query.sortBy ?? SortBy.default
            const sortDirection = req.query.sortDirection ?? SortDirection.default

            const posts = await this.postQueryRepository.getSortedPostsCurrentBlog(req.body.userId!, blog.id, Number(pageNumber), Number(pageSize), sortBy, sortDirection)
            res.status(HTTP_STATUS.OK_200).json(posts)
        }
    }

    async createPostCurrentBlog(req: ReqParamsBodyType<IdDTO, BlogCreateDTO>, res: Response) {
        const blog = await this.blogsService.getBlogById(req.params.id)

        if (!blog) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            const {title, shortDescription, content} = req.body

            const post = await this.postsService.createPost(title, shortDescription, content, blog)
            res.status(HTTP_STATUS.CREATED_201).json(post)
        }
    }
}