import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import exp from "constants";

// create express app
const app = express()
const port = process.env.PORT || 3000

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const db = {videos: [
    {id: 1, title: 'vid_1'},
    {id: 2, title: 'vid_2'},
    {id: 3, title: 'vid_3'},
    {id: 4, title: 'vid_4'}
]}
let errors = []

// testing:
app.get('', (req: Request, res: Response) => {
    res.send('Hello Incubator!!!')
})
app.get('/testing/all-data', (req: Request, res: Response) => {
    res.send('Hello Incubator!!!')
})

// videos:
app.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(db)
})
app.post('/videos', (req: Request, res: Response) => {
    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions
    const createdVideo = {
        id: +(new Date()),
        title: title,
        author: author,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date(),
        publicationDate: new Date(),
        availableResolutions: availableResolutions
    }
    let validation = true

    if (!title && typeof title !== 'string' && (title.length < 1 || title.length > 40)) {
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'title'
        })
        validation = false
        return;
    }
    if (!author && typeof author !== 'string' && (author.length < 1 || author.length > 40)) {
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
        res.status(201).send(createdVideo)
    } else {
        res.status(400).send({errorsMessages: errors})
    }
})

// проверить этот эндпоинт
app.get('/videos/:id', (req: Request, res: Response) => {   //добавить try/catch в этот эндпоинт??
    const foundVideo = db.videos.find(v => v.id === +req.params.id)

    if (!foundVideo) {              // If video for passed id doesn't exist
        res.status(404)
        return;
    }
    res.status(200).json(foundVideo)
})

// доделать этот эндпоинт
app.put('/videos/:id', (req: Request, res: Response) => {
    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions

    const foundVideo = db.videos.find(v => v.id === +req.params.id)
    let validation = true

    if (!foundVideo) {
        res.status(404)
        return;
    }
    if (validation) {
        foundVideo.title = req.body.title       // добавить обновление всех получаемых параметров
        res.status(204).json(foundVideo)    // почему мы получаем 204 no content? так написано в swagger
    } else {
        res.status(400).send({errorsMessages: errors})
    }
})

app.delete('/videos/:id', (req: Request, res: Response) => {   //добавить try/catch в этот эндпоинт??
    db.videos = db.videos.filter(vid => vid.id !== +req.params.id)

    if (!req.params.id) {
        res.status(404)
        return;
    }
    res.status(204)
})


// start app
app.listen(port, () => {
    console.log(`Server running on: http://localhost/${port}`)
})