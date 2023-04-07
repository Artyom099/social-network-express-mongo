import {app} from "./app";
const port = 3000   //process.env.PORT ||
// start app
app.listen(port, () => {
    console.log(`Server running on: http://localhost/${port}`)
})