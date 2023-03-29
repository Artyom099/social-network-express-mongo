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
const db = [{ videos: [{ id: 1, title: 'vid_1' },
            { id: 2, title: 'vid_2' },
            { id: 3, title: 'vid_3' },
            { id: 4, title: 'vid_4' }
        ]
    }];
let errors = [];
app.get('', (req, res) => {
    res.send('Hello Incubator!!!');
});
app.get('/testing/all-data', (req, res) => {
    res.send('Hello Incubator!!!');
});
app.get('/videos', (req, res) => {
    res.status(200).send(db);
});
app.post('/videos', (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    // validation:
    if (!title && typeof title !== 'string' && (title.length < 1 || title.length > 40)) {
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'title'
        });
        return;
    }
    if (!author && typeof title !== 'string' && (title.length < 1 || title.length > 40)) {
        errors.push({
            message: 'should be a string, max 40 symbols',
            field: 'author'
        });
        return;
    }
    if (!availableResolutions && typeof title !== 'arr' && (title.length < 1 || title.length > 40)) {
        errors.push({
            message: 'should be not nullable array',
            field: 'availableResolutions'
        });
        return;
    }
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
    res.status(400).send({ errorsMessages: errors });
    db.videos.push(createdVideo);
    res.status(201).send(createdVideo);
    // else
    // res.status(400)
    // res.json(errors)
    // return;
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
    }; // .find(v => v.id === +req.params.id) найти метод, который применяется к объекту вместо find
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
