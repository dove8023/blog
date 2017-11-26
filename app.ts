/*
 * @Author: Mr.He 
 * @Date: 2017-11-18 21:33:21 
 * @Last Modified by: Mr.He
 * @Last Modified time: 2017-11-26 20:30:22
 */
let express = require("express");
let conn_timeout = require("connect-timeout");
let bodyParser = require("body-parser");
let path = require("path");
import { articleDirectore, getArticle } from "./model";

let app = express();
app.use(conn_timeout("10s"));
app.use(bodyParser.json({ limit: '8mb' }));
app.use(bodyParser.urlencoded({ limit: '8mb', extended: true }));
app.use(express.static(path.join(__dirname, "www")));
app.set("view engine", "html");


app.get("/test", (req, res, next) => {
    console.log("test has been called.");
    res.send("test ok");
});

app.get("/articlelist", (req, res, next) => {
    res.json(articleDirectore);
});

app.use("/articleDetail/:path", (req, res, next) => {
    let filePath = req.params.path;
    let content = getArticle(filePath);
    res.send(content);
});

app.use("/", (req, res, next) => {
    console.log("here?");

    res.send("nothing get.");
    // res.sendStatus(404);
});


export default app;