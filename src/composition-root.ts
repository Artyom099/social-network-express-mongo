import {BlogsService} from "./domain/blogs-service";
import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsController} from "./controllers/blogs-controller";
import {FeedbackRepository} from "./repositories/feedback-repository";
import {FeedbackService} from "./domain/feedbacks-service";
import {FeedbackController} from "./controllers/feedback-controller";


const blogsRepository = new BlogsRepository()
const blogsService = new BlogsService(blogsRepository)
export const blogsController = new BlogsController(blogsService)

const feedbackRepository = new FeedbackRepository()
const feedbackService = new FeedbackService(feedbackRepository)
export const feedbackController = new FeedbackController(feedbackService)