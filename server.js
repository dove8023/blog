let express = require("express");
let http = require("http");
let path = require("path");
let app = express();

app.use(express.static(path.join(__dirname, "./www")));

http.createServer(app).listen(3000, ()=>{
    console.log("server running");
})
