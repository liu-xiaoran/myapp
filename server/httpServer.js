/**
 * Created by hxsd on 2016/11/11.
 */
var http = require("http");
var path = require("path");
var express = require("express");

var app = express();

// 处理对静态资源的请求
app.use(express.static(path.resolve(__dirname,"../client")));  // 使用中间件

var httpServer = http.createServer(app);

// 运行Socket Server
require("./socketServer")(httpServer);

httpServer.listen(3000,function(){
    console.log("服务器正运行在3000端口...");
});

