import {app} from "./app";
import {runDb} from "./db/db";
import dotenv from 'dotenv'

const port = process.env.PORT || 3000

dotenv.config()
const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
console.log(process.env.MONGO_URL)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Server running on: http://localhost/${port}`)
    })
}
startApp()