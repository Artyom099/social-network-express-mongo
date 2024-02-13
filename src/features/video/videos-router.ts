import {body} from "express-validator";
import express, {Request, Response} from "express";
import { ReqBodyType, ReqParamsBodyType, ReqParamsType, VideoViewModel, IdDTO, VideoCreateDTO, VideoUpdateDTO} from "../../infrastructure/types/types";
import {convertResultErrorCodeToHttp} from "../../infrastructure/utils/utils";
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
        const foundVideos = await videosService.findVideos()
        res.status(HTTP_STATUS.OK_200).send(foundVideos)
    })
    // authMiddleware,
    router.post('/', validationVideoPost, inputValidationMiddleware, async (req: ReqBodyType<VideoCreateDTO>, res: Response) => {
        const {title, author, availableResolutions} = req.body
        const createdVideo = await videosService.createVideo(title, author, availableResolutions)
        res.status(HTTP_STATUS.CREATED_201).json(createdVideo)
    })

    router.get('/:id', async (req: ReqParamsType<IdDTO>, res: Response<VideoViewModel>) => {
        const foundVideo = await videosService.findVideoById(req.params.id)
        if (!foundVideo) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        res.status(HTTP_STATUS.OK_200).json(foundVideo)
    })
    // authMiddleware,
    router.put('/:id', validationVideoPut, inputValidationMiddleware, async (req: ReqParamsBodyType<IdDTO, VideoUpdateDTO>, res: Response) => {
        const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body
        const result = await videosService.updateVideo(req.params.id, title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate)
        if (!result.data) {
            res.sendStatus(convertResultErrorCodeToHttp(result.code))
        } else {
            const updatedVideo = await videosService.findVideoById(req.params.id)
            res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedVideo)
        }
    })

    router.delete('/:id', async (req: ReqParamsType<IdDTO>, res: Response) => {
        const videoForDelete = await videosService.findVideoById(req.params.id)
        if (!videoForDelete) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            await videosService.deleteVideoById(req.params.id)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    })

    return router
}