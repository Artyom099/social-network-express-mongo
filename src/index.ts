import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

// create express app
export const app = express()
const port = process.env.PORT || 3000

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

type TDataBase = {
    videos: TVideo[]
}   //
type TVideo = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: string[]
}
type TBadRequestError = {
    message: string
    field: string
}
type VideoPostDTO = {
    title: string
    author: string
    availableResolutions: string[]
}
type VideoPutDTO = {
    title: string
    author: string
    availableResolutions: string[]
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    publicationDate: string
}
type VideoIdDTO = {
    id: string
}

type RequestBodyType<T> = Request<{},{},T>
type RequestHeadBodyType<U, Y> = Request<U,{},Y>

const HTTP_STATUS = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}
const db: TDataBase = {
    videos: []
}
const videoResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

// если существующий массив НЕ включается в себя элемент полученного массива ф-я выдает false
function checkArrayValues (existArray: string[], receivedArray: string[]): boolean {
    for(let i of receivedArray) {
        if (!existArray.includes(i)) return false
    }
    return true
}


// testing:
app.delete('/testing/all-data', (req: Request, res: Response) => {
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
})

// videos:
app.get('/videos', (req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK_200).send(db.videos)
})

app.post('/videos', (req: RequestBodyType<VideoPostDTO>, res: Response) => {
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

    // если валидция не прошла, отправляем массив с ошибками и выходим из эндпоинта
    if (errors.length > 0) {
        res.status(HTTP_STATUS.BAD_REQUEST_400).send({errorsMessages: errors})
    } else {
        const dateNow = new Date()
        const createdVideo: TVideo = {
            id: +dateNow,
            title: title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: dateNow.toISOString(),
            publicationDate: new Date(dateNow.setDate(dateNow.getDate() + 1)).toISOString(),
            availableResolutions
        }
        db.videos.push(createdVideo)
        res.status(HTTP_STATUS.CREATED_201).json(createdVideo)
    }
})

app.get('/videos/:id', (req: Request<{id: string}>, res: Response) => {
    // если не нашли видео по id, то сразу выдаем ошибку not found и выходим из эндпоинта
    const foundVideo = db.videos.find(v => v.id === +req.params.id)
    if (!foundVideo) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
    // иначе возвращаем найденное видео
    res.status(HTTP_STATUS.OK_200).json(foundVideo)
})

app.put('/videos/:id', (req: RequestHeadBodyType<VideoIdDTO, VideoPutDTO>, res: Response) => {
    // если не нашли видео по id, сразу выдаем ошибку not found и выходим из эндпоинта
    const foundVideo = db.videos.find(v => v.id === +req.params.id)
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

    // если данные НЕ прошли валидацию, отправляем массив с ошибками, иначе обновляем их
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

app.delete('/videos/:id', (req: Request<{id: string}>, res: Response) => {
    // если не нашли видео по id, то сразу выдаем ошибку not found и выходим из эндпоинта
    const videoForDelete = db.videos.find(v => v.id === +req.params.id)         // TODO можно сделать через findIndex + split?
    if (!videoForDelete) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

    db.videos = db.videos.filter(vid => vid.id !== +req.params.id)
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
})

// start app
app.listen(port, () => {
    console.log(`Server running on: http://localhost/${port}`)
})