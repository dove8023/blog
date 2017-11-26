/*
 * @Author: Mr.He 
 * @Date: 2017-11-18 21:33:17 
 * @Last Modified by: Mr.He
 * @Last Modified time: 2017-11-25 17:27:57
 */
import * as http from "http";
import app from "./app";

import model from "./model";

import "./model";

http.createServer(app).listen(3000, () => {
    console.log("server runing.");
});