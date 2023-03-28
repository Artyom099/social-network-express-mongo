import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

// create express app
const app = express()

const port = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Incubator!!!')
})


app.get('/videos', (req: Request, res: Response) => {
    res.sendStatus(200)
    res.json({
        "id": 0,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2023-03-28T17:34:46.859Z",
        "publicationDate": "2023-03-28",
        "availableResolution": ["P144"]
    })
    res.send('Return all videos')
})
app.post('/videos', (req: Request, res: Response) => {
    res.send('Create new video')
})

app.get('/videos/:id', (req: Request, res: Response) => {   //добавить try/catch в этот эндпоинт
    res.sendStatus(200)

    const foundVideo = {
        "id": 0,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2023-03-28T17:34:46.859Z",
        "publicationDate": "2023-03-28",
        "availableResolution": ["P144"]
    }.find(v => v.id === +req.params.id)    //найти метод, который применяется к объекту вместо find

    if (!foundVideo) {              // If video for passed id doesn't exist
        res.sendStatus(404)
        return;
    }
    res.json(foundVideo)
    res.send('Return video by id')
})




// start app
app.listen(port, () => {
    console.log(`Server running on: http://localhost/${port}`)
})