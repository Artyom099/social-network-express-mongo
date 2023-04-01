"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import {log} from "util";
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
};
const videoResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
// testing:
app.delete('/testing/all-data', (req, res) => {
    res.status(HTTP_STATUS.NO_CONTENT_204).send('All data is deleted');
});
// videos:
app.get('/videos', (req, res) => {
    res.status(HTTP_STATUS.OK_200).send(db);
});
app.post('/videos', (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const errors = [];
    // validation:
    let validation = true;
    if (!title || !title.trim() || title.length > 40) {
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'title'
        });
        validation = false;
    }
    if (!author || !author.trim() || author.length > 40) { //  && typeof author !== 'string'
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'author'
        });
        validation = false;
    }
    // TODO: includes должен перебирать элементы массива, а не сам массив
    if (!availableResolutions || availableResolutions.length > videoResolutions.length || videoResolutions.includes(availableResolutions.toString())) {
        errors.push({
            message: 'should be an array',
            field: 'availableResolutions'
        });
        validation = false;
    }
    // если валидция не прошла, отправляем массив с ошибками и выходим из эндпоинта
    if (!validation)
        return res.status(HTTP_STATUS.BAD_REQUEST_400).send({ errorsMessages: errors });
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
    return res.status(HTTP_STATUS.CREATED_201).send(createdVideo);
});
//TODO: в свагере id имеет тип integer, а в видео говорится, что надо типизировать как string, как быть?
app.get('/videos/:id', (req, res) => {
    // если не нашли видео по id, то сразу выдаем ошибку not found и выходим из эндпоинта
    const foundVideo = db.videos.find(v => v.id === +req.params.id);
    if (!foundVideo)
        return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    // иначе возвращаем найденное видео
    res.sendStatus(HTTP_STATUS.OK_200).json(foundVideo);
});
app.put('/videos/:id', (req, res) => {
    // если не нашли видео по id, сразу выдаем ошибку not found и выходим из эндпоинта
    const foundVideo = db.videos.find(v => v.id === +req.params.id);
    if (!foundVideo)
        return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    //TODO: destructure
    // const {title, author} = req.body
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const canBeDownloaded = req.body.canBeDownloaded;
    const minAgeRestriction = req.body.minAgeRestriction;
    const publicationDate = req.body.publicationDate;
    const errors = [];
    // validation:
    let validation = true;
    if (!title || !title.trim() || title.length > 40) {
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'title'
        });
        validation = false;
    }
    if (!author || !author.trim() || author.length > 40) { //  && typeof author !== 'string'
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'author'
        });
        validation = false;
    }
    if (!availableResolutions || !videoResolutions.includes(availableResolutions.toString())) {
        errors.push({
            message: 'resolution should be a P144, P240, P360, P480, P720, P1080, P1440 or P2160',
            field: 'availableResolutions'
        });
        validation = false;
    } // массив может быть пустой
    if (!canBeDownloaded) {
        errors.push({
            message: 'required property',
            field: 'canBeDownloaded'
        });
        validation = false;
    }
    if (!minAgeRestriction || typeof minAgeRestriction === 'number' || minAgeRestriction > 18) { // || typeof minAgeRestriction === 'null'
        errors.push({
            message: 'should be a number <= 18 or null',
            field: 'minAgeRestriction'
        });
        validation = false;
    }
    // если данные НЕ прошли валидацию, отправляем массив с ошибками, иначе обновляем их
    if (!validation) {
        res.status(HTTP_STATUS.BAD_REQUEST_400).send({ errorsMessages: errors });
    }
    else {
        foundVideo.title = title; // обновление всех полученных параметров
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
