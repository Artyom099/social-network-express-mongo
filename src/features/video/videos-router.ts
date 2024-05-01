import {body} from "express-validator";
import express, {Request, Response} from "express";
import { ReqBodyType, ReqParamsBodyType, ReqParamsType, VideoViewModel, IdDTO, VideoCreateDTO, VideoUpdateDTO} from "../../types";
import {convertResultErrorCodeToHttp} from "../../infrastructure/utils/handlers";
import {videosService} from "./videos-service";
import {HTTP_STATUS} from "../../infrastructure/utils/enums";
import {inputValidationMiddleware} from '../../infrastructure/middleware/input-validation-middleware';


export const videoResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

const validationVideoPost = [
    body('title').isString().isLength({min: 3, max: 40}).trim().not().isEmpty(),
    body('author').isString().isLength({min: 3, max: 20}).trim().not().isEmpty(),
    body('availableResolutions').isIn(videoResolutions)
]
const validationVideoPut = [
    ...validationVideoPost,
    body('canBeDownloaded').isBoolean(),
    body('minAgeRestriction').isNumeric(),
    body('publicationDate').isDate()
]

export const videosRouter = () => {
    const router = express.Router()

    router.get('/', async (req: Request, res: Response) => {
        const foundVideos = await videosService.getVideos();

        res.status(HTTP_STATUS.OK_200).send(foundVideos)
    })

    // authMiddleware,
    router.post('/', validationVideoPost, inputValidationMiddleware, async (req: ReqBodyType<VideoCreateDTO>, res: Response) => {
        const {title, author, availableResolutions} = req.body;

        const video = await videosService.createVideo(title, author, availableResolutions);

        res.status(HTTP_STATUS.CREATED_201).json(video)
    })

    router.get('/:id', async (req: ReqParamsType<IdDTO>, res: Response<VideoViewModel>) => {
        const video = await videosService.getVideo(req.params.id);

        if (!video) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);

        res.status(HTTP_STATUS.OK_200).json(video);
    })

    // authMiddleware,
    router.put('/:id', validationVideoPut, inputValidationMiddleware, async (req: ReqParamsBodyType<IdDTO, VideoUpdateDTO>, res: Response) => {
        const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body;

        const result = await videosService.updateVideo(req.params.id, title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate);

        if (!result.data) {
            res.sendStatus(convertResultErrorCodeToHttp(result.code));
        } else {
            const video = await videosService.getVideo(req.params.id);
            res.status(HTTP_STATUS.NO_CONTENT_204).json(video);
        }
    })

    router.delete('/:id', async (req: ReqParamsType<IdDTO>, res: Response) => {
        const video = await videosService.getVideo(req.params.id);

        if (!video) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        } else {
            await videosService.deleteVideo(req.params.id);
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
        }
    })

    return router
}