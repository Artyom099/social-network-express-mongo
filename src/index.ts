import {app} from "./app";
import {runDb} from "./db/db";
import jwt from "jsonwebtoken";

const port = process.env.PORT || 3000

const startApp = async () => {
    const token = jwt.sign({payload: 'any', hello: 'привет Артёму'} , 'any secret', {expiresIn: '20m'})
    console.log(token)
    console.log(jwt.decode(token))
    // @ts-ignore
    console.log(new Date(jwt.decode(token).iat * 1000).toLocaleString())

    await runDb()
    app.listen(port, () => {
        console.log(`Server running on: http://localhost/${port}`)
    })
}
startApp()