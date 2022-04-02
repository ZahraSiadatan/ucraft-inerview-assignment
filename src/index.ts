import config from "config";
import { Server } from "http";
import app from "./app";
let env = require("./env");

const server: Server = app.listen(config.get<string>("PORT"), () => {
    console.log(
        `${config.get<string>("APP_TITLE")} is running at`,
        `http://localhost:${config.get<string>("PORT")} in ${app.get("env")} mode`,
    );
    console.log(`Press CTRL-C to stop\n`);
});

export default server;