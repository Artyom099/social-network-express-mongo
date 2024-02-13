import {BlogsService} from "./features/blog/application/blogs-service";
import {CommentsRepository} from "./features/comments/infrasrtucture/comments-repository";
import {CommentsService} from "./features/comments/application/comments-service";
import {CommentsController} from "./features/comments/api/comments-controller";
import {PostsRepository} from "./features/post/infrastructure/posts-repository";
import {PostsService} from "./features/post/application/posts-service";
import {BlogsRepository} from './features/blog/infrastructure/blogs-repository';
import {BlogsController} from './features/blog/api/blogs-controller';
import {PostsController} from './features/post/api/posts-controller';
import {BlogQueryRepository} from './features/blog/infrastructure/blog.query.repository';
import {PostQueryRepository} from './features/post/infrastructure/post.query.repository';
import {CommentsQueryRepository} from './features/comments/infrasrtucture/comments-query.repository';

const blogsRepository = new BlogsRepository()
const blogQueryRepository = new BlogQueryRepository()
const blogsService = new BlogsService(blogsRepository)


const feedbackRepository = new CommentsRepository()
const commentsQueryRepository = new CommentsQueryRepository()
const feedbackService = new CommentsService(feedbackRepository)


const postsRepository = new PostsRepository()
const postQueryRepository = new PostQueryRepository()
const postsService = new PostsService(postsRepository)



export const commentsController = new CommentsController(feedbackService)

export const blogsController = new BlogsController(
  blogsService,
  postsService,
  blogQueryRepository,
  postQueryRepository)

export const postsController = new PostsController(
  postsService,
  blogsService,
  feedbackService,
  postQueryRepository,
  commentsQueryRepository)

