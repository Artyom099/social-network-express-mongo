import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import exp from "constants";

// create express app
const app = express()
const port = process.env.PORT || 3000

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

type TDataBase={
    videos: TVideo[]
}
type TVideo = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: string[]
}
type TBadRequestError ={
    message: string
    field: string
}

const HTTP_STATUS = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}
const db: TDataBase = {
    videos: [
        {
            id: 1,
            title: 'vid_1',
            author: 'writer_1',
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: ['P144']
        }
    ]
}
const videoResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']


// testing:
app.delete('/testing/all-data', (req: Request, res: Response) => {
    // очистить db
    res.status(HTTP_STATUS.NO_CONTENT_204).send('All data is deleted')
})

// videos:
app.get('/videos', (req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK_200).send(db)
})

app.post('/videos', (req: Request<{},{},{title: string, author: string, availableResolutions: string[]}>, res: Response) => {
    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions
    const createdAt = new Date()
    const publicationDate = createdAt.setDate(createdAt.getDate() + 1)      // ругется на тип, когда использую эту переменную
    const createdVideo = {          // ругается на тип : TVideo
        id: +(new Date()),
        title: title,
        author: author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate:  new Date().toISOString(),                 // вот здесь ругается
        availableResolutions: availableResolutions
    }
    const errors: TBadRequestError[] = []

    // validation:
    let validation = true
    if (!title || !title.trim() || title.length > 40) {
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'title'
        })
        validation = false
        return;
    }
    if (!author || !author.trim() || author.length > 40) {         //  && typeof author !== 'string'
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'author'
        })
        validation = false
        return;
    }
    // если ставлю тип string[], ругается на метод .length
    if (!availableResolutions && videoResolutions.includes(availableResolutions)) {
        errors.push({
            message: 'should be an array',
            field: 'availableResolutions'
        })
        validation = false
        return;
    }

    // если данные прошли валидацию, то добавляем их в БД, иначе отправляем массив с ошибками
    // в каком месте if/else надо ставить return, а в каком - нет?
    if (validation) {
        db.videos.push(createdVideo)
        res.status(HTTP_STATUS.CREATED_201).send(createdVideo)
        return;
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST_400).send({errorsMessages: errors})
    }
})

//в свагере id имеет тип integer, а в видео говорится, что надо типизировать как string, как быть?
app.get('/videos/:id', (req: Request<{id: string}>, res: Response) => {
    // если не нашли видео по id, то сразу выдаем ошибку not found
    const foundVideo = db.videos.find(v => v.id === +req.params.id)
    if (!foundVideo) {
        res.status(HTTP_STATUS.NOT_FOUND_404)
        return;
    }
    res.status(HTTP_STATUS.OK_200).json(foundVideo)
})

app.put('/videos/:id', (req: Request<{id: string},{},{title: string, author: string, availableResolutions: string[],
                            canBeDownloaded: boolean, minAgeRestriction: number | null, publicationDate: string}>, res: Response) => {
    // если не нашли видео по id, то сразу выдаем ошибку not found
    const foundVideo = db.videos.find(v => v.id === +req.params.id)
    if (!foundVideo) {
        res.status(HTTP_STATUS.NOT_FOUND_404)
        return;
    }

    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions
    const canBeDownloaded = req.body.canBeDownloaded
    const minAgeRestriction = req.body.minAgeRestriction
    const publicationDate = req.body.publicationDate       // где мы берем publicationDate при обновлении данных? если в body, тогда все ок
    const errors: TBadRequestError[] = []

    // validation:
    let validation = true
    if (!title || !title.trim() || title.length > 40) {
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'title'
        })
        validation = false
        return;
    }
    if (!author || !author.trim() || author.length > 40) {         //  && typeof author !== 'string'
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'author'
        })
        validation = false
        return;
    }
    if (!availableResolutions && videoResolutions.includes(availableResolutions)) {
        errors.push({
            message: 'resolution should be a P144, P240, P360, P480, P720, P1080, P1440 or P2160',
            field: 'availableResolutions'
        })
        validation = false
        return;
    }   // массив может быть пустой или нет? из свагера непонятно
    if (!canBeDownloaded) {
        errors.push({
            message: 'required property',
            field: 'canBeDownloaded'
        })
        validation = false
        return;
    }                                                           // вроде ок
    if (!minAgeRestriction && ((typeof minAgeRestriction === 'number' && (minAgeRestriction < 0 || minAgeRestriction > 18))   )){  // || typeof minAgeRestriction === 'null'
        errors.push({
            message: 'should be a number <= 18 or null',
            field: 'minAgeRestriction'
        })
        validation = false
        return;
    }

    // если данные прошли валидацию, то обновляем их, иначе отправляем массив с ошибками
    if (validation) {
        foundVideo.title = title                                   // обновление всех полученных параметров
        foundVideo.author = author
        foundVideo.availableResolutions = availableResolutions
        foundVideo.canBeDownloaded = canBeDownloaded
        foundVideo.minAgeRestriction = minAgeRestriction
        foundVideo.publicationDate = publicationDate
        res.status(HTTP_STATUS.NO_CONTENT_204).json(foundVideo)
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST_400).send({errorsMessages: errors})
    }
})

// вроде выполняется, но постман выдает ошибку Error: read ECONNRESET
app.delete('/videos/:id', (req: Request<{id: string}>, res: Response) => {
    // если не нашли видео по id, то сразу выдаем ошибку not found
    db.videos = db.videos.filter(vid => vid.id !== +req.params.id)
    if (!req.params.id) {
        res.status(HTTP_STATUS.NOT_FOUND_404)
        return;
    }
    res.status(HTTP_STATUS.NO_CONTENT_204)
})


// start app
app.listen(port, () => {
    console.log(`Server running on: http://localhost/${port}`)
})