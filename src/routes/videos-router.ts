import {body} from "express-validator";
import express, {Request, Response} from "express";
import {
    RequestBodyType,
    RequestParamsBodyType,
    RequestParamsType,
    TVideo,
    VideoIdDTO,
    VideoPostDTO, VideoPutDTO
} from "../types";
import {convertResultErrorCodeToHttp, HTTP_STATUS} from "../utils";
import {videosRepository} from "../repositories/videos-repository";
import {authMiddleware, inputValidationMiddleware} from "../middleware/input-validation-middleware";


export const videoResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
// export function checkArrayValues(existArray: string[], receivedArray: string[]): boolean {
//     for (let i of receivedArray) {
//         if (!existArray.includes(i)) return false
//     }
//     return true
// }
// const titleValidation = body('title').isString().isLength({min: 3, max: 40}).trim().not().isEmpty()
// const authorValidation = body('author').isString().isLength({min: 3, max: 20}).trim().not().isEmpty()
// const availableResolutionsValidation = body('availableResolutions').isIn(videoResolutions)
// const canBeDownloadedValidation = body('canBeDownloaded').isBoolean()
// const minAgeRestrictionValidation = body('minAgeRestriction').isNumeric()
// const publicationDateValidation = body('publicationDate').isDate()

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

export const getVideosRouter = () => {
    const router = express.Router()

    router.get('/', async (req: Request, res: Response) => {
        const foundVideos = await videosRepository.findVideos()
        res.status(HTTP_STATUS.OK_200).send(foundVideos)
    })

    router.post('/', validationVideoPost, authMiddleware, inputValidationMiddleware,
        async (req: RequestBodyType<VideoPostDTO>, res: Response) => {
        const {title, author, availableResolutions} = req.body
        const createdVideo = await videosRepository.createVideos(title, author, availableResolutions)
        res.status(HTTP_STATUS.CREATED_201).json(createdVideo)

        // const errors: TBadRequestError[] = []
        // if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        //     errors.push({
        //         message: 'should be a string',
        //         field: 'title'
        //     })
        // }
        // if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        //     errors.push({
        //         message: 'should be a string, max 40 symbols',
        //         field: 'author'
        //     })
        // }
        // // если availableResolutions НЕ существует ИЛИ (длина не равна нулю И данные НЕ савпадают с допустимыми значениями)
        // if (!availableResolutions || (availableResolutions.length !== 0 && !checkArrayValues(videoResolutions, availableResolutions))) {
        //     errors.push({
        //         message: 'should be an array',
        //         field: 'availableResolutions'
        //     })
        // }
        //
        // if (errors.length > 0) {
        //     res.status(HTTP_STATUS.BAD_REQUEST_400).send({errorsMessages: errors})
        // } else {
        //     const createdVideo = await videosRepository.createVideos(title, author, availableResolutions)
        //     res.status(HTTP_STATUS.CREATED_201).json(createdVideo)
        // }
    })

    router.get('/:id', async (req: RequestParamsType<VideoIdDTO>, res: Response<TVideo>) => {
        const foundVideo = await videosRepository.findVideoById(req.params.id)
        if (!foundVideo) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        res.status(HTTP_STATUS.OK_200).json(foundVideo)
    })

    router.put('/:id', validationVideoPut, authMiddleware, inputValidationMiddleware,
        async (req: RequestParamsBodyType<VideoIdDTO, VideoPutDTO>, res: Response) => {
        // const foundVideo = await videosRepository.findVideoById(req.params.id)
        // if (!foundVideo) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body
        const result = await videosRepository.updateVideo(req.params.id, title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate)

        if (!result.data) return res.sendStatus(convertResultErrorCodeToHttp(result.code))

        const updatedVideo = await videosRepository.findVideoById(req.params.id)
        res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedVideo)


        // const errors: TBadRequestError[] = []
        // if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        //     errors.push({
        //         message: 'should be a string',
        //         field: 'title'
        //     })
        // }
        // if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {         //  && typeof author !== 'string'
        //     errors.push({
        //         message: 'should be a string, max 40 symbols',
        //         field: 'author'
        //     })
        // }
        // if (!availableResolutions || (availableResolutions.length !== 0 && !checkArrayValues(videoResolutions, availableResolutions))) {
        //     errors.push({
        //         message: 'should be an array',
        //         field: 'availableResolutions'
        //     })
        // }
        // if (!canBeDownloaded || typeof canBeDownloaded !== 'boolean') {
        //     errors.push({
        //         message: 'required property',
        //         field: 'canBeDownloaded'
        //     })
        // }
        // if (!minAgeRestriction || typeof minAgeRestriction !== 'number' || minAgeRestriction > 18) {
        //     errors.push({
        //         message: 'should be a number <= 18 or null',
        //         field: 'minAgeRestriction'
        //     })
        // }
        // if (!publicationDate || typeof publicationDate !== 'string') {
        //     errors.push({
        //         message: 'should be a string',
        //         field: 'publicationDate'
        //     })
        // }
        //
        // if (errors.length > 0) {
        //     res.status(HTTP_STATUS.BAD_REQUEST_400).send({errorsMessages: errors})
        // } else {
        //     const updatedVideo = await videosRepository.updateVideo(foundVideo, title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate)
        //     res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedVideo)
        // }
    })

    router.delete('/:id', async (req: RequestParamsType<VideoIdDTO>, res: Response) => {
        const videoForDelete = await videosRepository.findVideoById(req.params.id)
        if (!videoForDelete) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        await videosRepository.deleteVideoById(req.params.id)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

    return router
}