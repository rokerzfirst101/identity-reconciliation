import express from 'express';
import * as bodyParser from 'body-parser';
import {router} from "./router/contact.router"

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

app.use("", router);

app.listen(PORT, () => {
    console.info(`Server started at http://localhost:${PORT}`)
})