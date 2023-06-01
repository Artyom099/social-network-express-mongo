import {BlogsService} from "./domain/blogs-service";
import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsController} from "./controllers/blogs-controller";


const blogsRepository = new BlogsRepository()
const blogsService = new BlogsService(blogsRepository)
export const blogsController = new BlogsController(blogsService)