"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// create express app
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Hello Incubator!!!');
});
app.get('/videos', (req, res) => {
    res.sendStatus(200);
    res.json({
        "id": 0,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2023-03-28T17:34:46.859Z",
        "publicationDate": "2023-03-28",
        "availableResolution": ["P144"]
    });
    res.send('Return all videos');
});
app.post('/videos', (req, res) => {
    res.send('Create new video');
});
app.get('/videos/:id', (req, res) => {
    res.sendStatus(200);
    const foundVideo = {
        "id": 0,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2023-03-28T17:34:46.859Z",
        "publicationDate": "2023-03-28",
        "availableResolution": ["P144"]
    }.find(v => v.id === +req.params.id); //найти метод, который применяется к объекту вместо find
    if (!foundVideo) { // If video for passed id doesn't exist
        res.sendStatus(404);
        return;
    }
    res.json(foundVideo);
    res.send('Return video by id');
});
// start app
app.listen(port, () => {
    console.log(`Server running on: http://localhost/${port}`);
});
