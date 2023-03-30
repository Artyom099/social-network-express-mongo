import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import exp from "constants";

// create express app
const app = express()
const port = process.env.PORT || 3000

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const HTTP_STATUS = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}
const videoResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
type VideoType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: any,
    createdAt: string,
    publicationDate: string,
    availableResolutions: string
}
const db = {} = {       // videos: VideoType[] - выдает ошибку, почему?
    videos: [
        {
            id: 1,
            title: 'vid_1',
            author: 'writer_1',
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: new Date(),
            publicationDate: new Date(),
            availableResolutions: ['P144']
        },
        {
            id: 2,
            title: 'vid_2',
            author: 'writer_2',
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: '2023-03-30T14:56:02.264Z',
            publicationDate: '2023-03-30T14:56:02.264Z',
            availableResolutions: ['P144']
        },
    ]
}
let errors = []

// testing:
app.delete('/testing/all-data', (req: Request, res: Response) => {
    // очистить db
    res.status(HTTP_STATUS.NO_CONTENT_204).send('All data is deleted')
})

// videos:
app.get('/videos', (req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK_200).send(db)
})
app.post('/videos', (req: Request<{},{},{title: string, author: string, availableResolutions: any}>,
                                 res: Response) => {
    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions
    const createdVideo = {
        id: +(new Date()),
        title: title,
        author: author,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: availableResolutions
    }
    let validation = true

    if (!title && (title.length < 1 || title.length > 40)) {
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'title'
        })
        validation = false
        return;
    }
    if (!author && (author.length < 1 || author.length > 40)) {         //  && typeof author !== 'string'
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'author'
        })
        validation = false
        return;
    }
    // уточнить условие !availableResolutions.isArray()
    if (!availableResolutions && !availableResolutions.isArray() && availableResolutions.length !== 0) {
        errors.push({
            message: 'should be not nullable array',
            field: 'availableResolutions'
        })
        validation = false
        return;
    }

    if (validation) {
        db.videos.push(createdVideo)
        res.status(HTTP_STATUS.CREATED_201).send(createdVideo)
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST_400).send({errorsMessages: errors})
    }
})

// проверить этот эндпоинт
app.get('/videos/:id', (req: Request<{id: string}>, res: Response) => {   //добавить try/catch в этот эндпоинт??
    const foundVideo = db.videos.find(v => v.id === +req.params.id)

    if (!foundVideo) {              // If video for passed id doesn't exist
        res.status(HTTP_STATUS.NOT_FOUND_404)
        return;
    }
    res.status(HTTP_STATUS.OK_200).json(foundVideo)
})
// доделать этот эндпоинт
app.put('/videos/:id', (req: Request<{id: string},{},{title: string, author: string, availableResolutions: any}>,
                                    res: Response) => {     // надо ли здесь типизировать Response?
    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions

    const foundVideo = db.videos.find(v => v.id === +req.params.id)
    let validation = true

    // здесть написать validation !

    if (!foundVideo) {
        res.status(HTTP_STATUS.NOT_FOUND_404)
        return;
    }
    if (validation) {
        foundVideo.title = req.body.title       // добавить обновление всех получаемых параметров
        res.status(HTTP_STATUS.NO_CONTENT_204).json(foundVideo)    // почему мы получаем 204 no content? так написано в swagger
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST_400).send({errorsMessages: errors})
    }
})

app.delete('/videos/:id', (req: Request<{id: string}>, res) => {
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