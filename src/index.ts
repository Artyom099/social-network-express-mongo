import {app} from "./app";
import {runDb} from "./db/db";

const port = process.env.PORT || 3000

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Server running on: http://localhost/${port}`)
    })
}
startApp()