import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

// create express app
const app = express()

const port = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Incubator!!!')
})


// start app
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})