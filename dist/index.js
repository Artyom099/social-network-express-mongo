"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// create express app
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const jsonBodyMiddleware = express_1.default.json();
app.use(jsonBodyMiddleware);
const db = { videos: [
        { id: 1, title: 'vid_1' },
        { id: 2, title: 'vid_2' },
        { id: 3, title: 'vid_3' },
        { id: 4, title: 'vid_4' }
    ] };
let errors = [];
// testing:
app.delete('/testing/all-data', (req, res) => {
    // очистить db
    res.status(204).send('All data is deleted');
});
// videos:
app.get('/videos', (req, res) => {
    res.status(200).send(db);
});
app.post('/videos', (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const createdVideo = {
        id: +(new Date()),
        title: title,
        author: author,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date(),
        publicationDate: new Date(),
        availableResolutions: availableResolutions
    };
    let validation = true;
    if (!title && typeof title !== 'string' && (title.length < 1 || title.length > 40)) {
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'title'
        });
        validation = false;
        return;
    }
    if (!author && typeof author !== 'string' && (author.length < 1 || author.length > 40)) {
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'author'
        });
        validation = false;
        return;
    }
    // уточнить условие !availableResolutions.isArray()
    if (!availableResolutions && !availableResolutions.isArray() && availableResolutions.length !== 0) {
        errors.push({
            message: 'should be not nullable array',
            field: 'availableResolutions'
        });
        validation = false;
        return;
    }
    if (validation) {
        db.videos.push(createdVideo);
        res.status(201).send(createdVideo);
    }
    else {
        res.status(400).send({ errorsMessages: errors });
    }
});
// проверить этот эндпоинт
app.get('/videos/:id', (req, res) => {
    const foundVideo = db.videos.find(v => v.id === +req.params.id);
    if (!foundVideo) { // If video for passed id doesn't exist
        res.status(404);
        return;
    }
    res.status(200).json(foundVideo);
});
// доделать этот эндпоинт
app.put('/videos/:id', (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const foundVideo = db.videos.find(v => v.id === +req.params.id);
    let validation = true;
    // здесть написать validation
    if (!foundVideo) {
        res.status(404);
        return;
    }
    if (validation) {
        foundVideo.title = req.body.title; // добавить обновление всех получаемых параметров
        res.status(204).json(foundVideo); // почему мы получаем 204 no content? так написано в swagger
    }
    else {
        res.status(400).send({ errorsMessages: errors });
    }
});
app.delete('/videos/:id', (req, res) => {
    db.videos = db.videos.filter(vid => vid.id !== +req.params.id);
    if (!req.params.id) {
        res.status(404);
        return;
    }
    res.status(204);
});
// start app
app.listen(port, () => {
    console.log(`Server running on: http://localhost/${port}`);
});
