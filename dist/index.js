"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = process.env.PORT || 3000;
// start app
app_1.app.listen(port, () => {
    console.log(`Server running on: http://localhost/${port}`);
});
