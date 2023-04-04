"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const port = process.env.PORT || 3000;
// start app
settings_1.app.listen(port, () => {
    console.log(`Server running on: http://localhost/${port}`);
});
