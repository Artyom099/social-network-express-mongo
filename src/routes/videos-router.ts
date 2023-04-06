import express, {Request, Response} from "express";
import {
    RequestBodyType,
    RequestParamsBodyType,
    RequestParamsType,
    TBadRequestError, TDataBase,
    TVideo,
    VideoIdDTO,
    VideoPostDTO, VideoPutDTO
} from "../types";
import {HTTP_STATUS} from "../utils";
import {videosRepository} from "../repositories/videos-repository";

export const videoResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
export function checkArrayValues(existArray: string[], receivedArray: string[]): boolean {
    for (let i of receivedArray) {
        if (!existArray.includes(i)) return false
    }
    return true
}

export const getVideosRouter = (db: TDataBase) => {
    const router = express.Router()
    router.get('/', (req: Request, res: Response) => {
        const foundVideos = videosRepository.findVideos()
        res.status(HTTP_STATUS.OK_200).send(foundVideos)
    })
    router.post('/', (req: RequestBodyType<VideoPostDTO>, res: Response) => {
        const {title, author, availableResolutions} = req.body
        const errors: TBadRequestError[] = []

        // validation:
        if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
            errors.push({
                message: 'should be a string',
                field: 'title'
            })
        }
        if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
            errors.push({
                message: 'should be a string, max 40 symbols',
                field: 'author'
            })
        }
        // если availableResolutions НЕ существует ИЛИ (длина не равна нулю И данные НЕ савпадают с допустимыми значениями)
        if (!availableResolutions || (availableResolutions.length !== 0 && !checkArrayValues(videoResolutions, availableResolutions))) {
            errors.push({
                message: 'should be an array',
                field: 'availableResolutions'
            })
        }

        if (errors.length > 0) {
            res.status(HTTP_STATUS.BAD_REQUEST_400).send({errorsMessages: errors})
        } else {
            const dateNow = new Date()
            const createdVideo: TVideo = {
                id: (+dateNow).toString(),
                title,
                author,
                canBeDownloaded: false,
                minAgeRestriction: null,
                createdAt: dateNow.toISOString(),
                publicationDate: new Date(dateNow.setDate(dateNow.getDate() + 1)).toISOString(),
                availableResolutions
            }
            const createVideo = videosRepository.createVideos(createdVideo)
            res.status(HTTP_STATUS.CREATED_201).json(createVideo)
        }
    })
    router.get('/:id', (req: RequestParamsType<VideoIdDTO>, res: Response) => {
        // если не нашли видео по id, то сразу выдаем ошибку not found и выходим из эндпоинта
        const foundVideo = db.videos.find(v => v.id === req.params.id)
        if (!foundVideo) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        // иначе возвращаем найденное видео
        res.status(HTTP_STATUS.OK_200).json(foundVideo)
    })  //TODO добавить типизацию на Response
    router.put('/:id', (req: RequestParamsBodyType<VideoIdDTO, VideoPutDTO>, res: Response) => {
        // если не нашли видео по id, сразу выдаем ошибку not found и выходим из эндпоинта
        const foundVideo = db.videos.find(v => v.id === req.params.id)
        if (!foundVideo) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body
        const errors: TBadRequestError[] = []

        // validation:
        if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
            errors.push({
                message: 'should be a string',
                field: 'title'
            })
        }
        if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {         //  && typeof author !== 'string'
            errors.push({
                message: 'should be a string, max 40 symbols',
                field: 'author'
            })
        }
        if (!availableResolutions || (availableResolutions.length !== 0 && !checkArrayValues(videoResolutions, availableResolutions))) {
            errors.push({
                message: 'should be an array',
                field: 'availableResolutions'
            })
        }
        if (!canBeDownloaded || typeof canBeDownloaded !== 'boolean') {
            errors.push({
                message: 'required property',
                field: 'canBeDownloaded'
            })
        }
        if (!minAgeRestriction || typeof minAgeRestriction !== 'number' ||  minAgeRestriction > 18) {
            errors.push({
                message: 'should be a number <= 18 or null',
                field: 'minAgeRestriction'
            })
        }
        if (!publicationDate || typeof publicationDate !== 'string') {
            errors.push({
                message: 'should be a string',
                field: 'publicationDate'
            })
        }

        // если ошибки есть, отправляем их и выходим из эндпоинта
        if (errors.length > 0) {
            res.status(HTTP_STATUS.BAD_REQUEST_400).send({errorsMessages: errors})
        } else {
            foundVideo.title = title
            foundVideo.author = author
            foundVideo.availableResolutions = availableResolutions
            foundVideo.canBeDownloaded = canBeDownloaded
            foundVideo.minAgeRestriction = minAgeRestriction
            foundVideo.publicationDate = publicationDate
            res.status(HTTP_STATUS.NO_CONTENT_204).json(foundVideo)
        }
    })
    router.delete('/:id', (req: RequestParamsType<VideoIdDTO>, res: Response) => {
        const videoForDelete = db.videos.find(v => v.id === req.params.id)         // TODO можно сделать через findIndex + split?
        if (!videoForDelete) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        db.videos = db.videos.filter(vid => vid.id !== req.params.id)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })
    return router
}