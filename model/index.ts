/*
 * @Author: Mr.He 
 * @Date: 2017-11-19 23:04:36 
 * @Last Modified by: Mr.He
 * @Last Modified time: 2017-11-26 20:26:51
 */

import * as fs from "fs";
import * as path from "path";
import { markdown } from 'markdown';

export function dirStructor(str: string) {
    let files = fs.readdirSync(str);
    let result = {},
        rootPath = process.cwd(),
        reg = new RegExp(rootPath, "ig");

    for (let file of files) {
        let oneFilePath = path.join(str, file);
        let stat = fs.statSync(path.join(str, file));
        if (stat.isDirectory()) {
            result[file] = dirStructor(oneFilePath);
        } else {
            result[file] = oneFilePath.replace(reg, "");
        }
    }
    return result;
}

export let articleDirectore = dirStructor(path.join(__dirname, "../article"));


export function getArticle(str: string) {
    str += ".md";
    let files = str.split("-");
    let filePath = path.join(process.cwd(), "article", ...files);
    let result;
    try {
        result = fs.readFileSync(filePath);
    } catch (e) {
        // console.log(e);
        return "<h1>Not have this file.</h1>";
    }

    let htmlResult = markdown.toHTML(result.toString());

    return htmlResult;
}