import {app} from './settings'
const port = process.env.PORT || 3000

// start app
app.listen(port, () => {
    console.log(`Server running on: http://localhost/${port}`)
})