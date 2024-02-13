import {runDb} from "./infrastructure/db/db";
import express from "express";
import {appSettings} from "./app.settings";

const port = process.env.PORT || 3002
export const app = express()
appSettings(app)

const startApp = async() => {
    await runDb()
    app.listen(port, () => {
        console.log(`Server running on: http://localhost:${port}`)
    })
}
startApp()