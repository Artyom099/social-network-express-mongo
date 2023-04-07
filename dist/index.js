"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = 3000; //process.env.PORT ||
// start app
app_1.app.listen(port, () => {
    console.log(`Server running on: http://localhost/${port}`);
});
