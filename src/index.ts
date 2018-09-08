import "./config";
import "./redis";
import "./schemas";

import { json, urlencoded } from "body-parser";
import * as express from "express";
import { MainRouter } from "./routes";

const app: express.Application = express();

const port: number = parseInt(process.env.PORT, 10) || 3000;

app.use(json());
app.use(urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, auth, *");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(MainRouter);

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Listening on port ${port}`);
});
