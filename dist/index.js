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
const HTTP_STATUS = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
};
const db = {
    videos: []
};
const videoResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
// если существующий массив НЕ включается в себя элемент полученного массива ф-я выдает false
function checkArrayValues(existArray, receivedArray) {
    for (let i in receivedArray) {
        if (!existArray.includes(i))
            return false;
    }
    return true;
}
// testing:
app.delete('/testing/all-data', (req, res) => {
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});
// videos:
app.get('/videos', (req, res) => {
    res.status(HTTP_STATUS.OK_200).send(db.videos);
});
app.post('/videos', (req, res) => {
    const { title, author, availableResolutions } = req.body;
    const errors = [];
    // validation:
    let validation = true;
    if (!title || !title.trim() || title.length > 40 || typeof title !== 'string') {
        errors.push({
            message: 'should be a string',
            field: 'title'
        });
        validation = false;
    }
    if (!author || !author.trim() || author.length > 20 || typeof author !== 'string') { //  && typeof author !== 'string'
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'author'
        });
        validation = false;
    }
    // если availableResolutions НЕ существует ИЛИ (длина не равна нулю И данные НЕ савпадают с допустимыми значениями)
    if (!availableResolutions || (availableResolutions.length !== 0 && !checkArrayValues(videoResolutions, availableResolutions))) {
        errors.push({
            message: 'should be an array',
            field: 'availableResolutions'
        });
        validation = false;
    }
    // если валидция не прошла, отправляем массив с ошибками и выходим из эндпоинта
    if (!validation) {
        res.status(HTTP_STATUS.BAD_REQUEST_400).send({ errorsMessages: errors });
    }
    else {
        const dateNow = new Date();
        const createdVideo = {
            id: +dateNow,
            title: title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: dateNow.toISOString(),
            publicationDate: new Date(dateNow.setDate(dateNow.getDate() + 1)).toISOString(),
            availableResolutions
        };
        db.videos.push(createdVideo);
        res.status(HTTP_STATUS.CREATED_201).json(createdVideo);
    }
});
app.get('/videos/:id', (req, res) => {
    // если не нашли видео по id, то сразу выдаем ошибку not found и выходим из эндпоинта
    const foundVideo = db.videos.find(v => v.id === +req.params.id);
    if (!foundVideo)
        return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    // иначе возвращаем найденное видео
    res.status(HTTP_STATUS.OK_200).json(foundVideo);
});
app.put('/videos/:id', (req, res) => {
    // если не нашли видео по id, сразу выдаем ошибку not found и выходим из эндпоинта
    const foundVideo = db.videos.find(v => v.id === +req.params.id);
    if (!foundVideo)
        return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
    const errors = [];
    // validation:
    let validation = true;
    if (!title || !title.trim() || title.length > 40 || typeof title !== 'string') {
        errors.push({
            message: 'should be a string',
            field: 'title'
        });
        validation = false;
    } //  && typeof title !== 'string'
    if (!author || !author.trim() || author.length > 20 || typeof author !== 'string') { //  && typeof author !== 'string'
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'author'
        });
        validation = false;
    }
    if (!availableResolutions || (availableResolutions.length !== 0 && !checkArrayValues(videoResolutions, availableResolutions))) {
        errors.push({
            message: 'should be an array',
            field: 'availableResolutions'
        });
        validation = false;
    }
    if (!canBeDownloaded || typeof canBeDownloaded !== 'boolean') {
        errors.push({
            message: 'required property',
            field: 'canBeDownloaded'
        });
        validation = false;
    }
    if (!minAgeRestriction || minAgeRestriction > 18 || typeof minAgeRestriction !== 'number') { // || typeof minAgeRestriction === 'null'
        errors.push({
            message: 'should be a number <= 18 or null',
            field: 'minAgeRestriction'
        });
        validation = false;
    }
    if (!publicationDate || typeof publicationDate !== 'string') {
        errors.push({
            message: 'should be a string',
            field: 'publicationDate'
        });
        validation = false;
    }
    // если данные НЕ прошли валидацию, отправляем массив с ошибками, иначе обновляем их
    if (!validation) {
        res.status(HTTP_STATUS.BAD_REQUEST_400).send({ errorsMessages: errors });
    }
    else {
        foundVideo.title = title;
        foundVideo.author = author;
        foundVideo.availableResolutions = availableResolutions;
        foundVideo.canBeDownloaded = canBeDownloaded;
        foundVideo.minAgeRestriction = minAgeRestriction;
        foundVideo.publicationDate = publicationDate;
        res.status(HTTP_STATUS.NO_CONTENT_204).json(foundVideo);
    }
});
app.delete('/videos/:id', (req, res) => {
    // если не нашли видео по id, то сразу выдаем ошибку not found и выходим из эндпоинта
    const videoForDelete = db.videos.find(v => v.id === +req.params.id);
    if (!videoForDelete)
        return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    db.videos = db.videos.filter(vid => vid.id !== +req.params.id);
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});
// start app
app.listen(port, () => {
    console.log(`Server running on: http://localhost/${port}`);
});
