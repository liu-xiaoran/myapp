
// 引入socket.io模块
var socketIO = require("socket.io");
var game = require("./game");
var config=require("./gameConfig");

module.exports = function (httpServer) {
    // 让socket.io监听web服务器，并返回socket.io服务器
    var socketServer = socketIO.listen(httpServer);
    //建立一个参与玩家的列表
    var playerlist=[];

    var colorMap ={};
    // socket服务器会监听所有客户端的连接请求
    // 当有客户端连接请求到达时，会触发一个"connect"事件
    // 每一个客户端请求，服务器端都会创建一个新的socket对象，负责和对方通信
    socketServer.on("connect", function (socket) {
        // 服务器socket监听客户端发过来的消息
        socket.on("message", function (data) {
            // 提取收到的消息的类型
            var type=data.type;
            switch(type){
                case "enter":
                var username=data.name;
                var player={
                    name:username,
                    color:whatColor()

                }
                playerlist.push(player);
               
                io.sockets.send(color);
                colorMap[socket.id] = color;

                if(playerlist.length==2){
                    var data={
                        type:"startGame",
                        row:start.row,
                        col:start.col
                    }
                    io.sockets.send(data);
                }
                break;
                case "play":
                var x=data.x;
                var y=data.y;
                if(game.isExist(x,y)==false){
                    var data={
                        type:"play",
                        x:x,
                        y:y
                    }
                    io.sockets.send(data);
                }else{
                    var error={
                        type:"error"
                    }
                    io.sockets.send(error);   
                }
                var soColor = colorMap[socket.id];
                    if(game.isCurrColor(soColor)){
                        game.putChess(x,y);
                        if(game.winColor){
                            var winner={
                                type:"end",
                                color:game.winColor
                            }
                            io.sockets.send(winner)
                            return;
                        }
                    }  
                break;
            } 
        });

        // 向客户端发送消息:
        // 有两个方法：send-发送的是默认叫做"message"的消息,
        //             emit-发送自定义名称的消息
        // 以下方法的两个参数：参数1:消息名称;参数2:消息内容
        //socket.emit("hello","欢迎您，新朋友!");

        // 服务器socket监听客户端发过来的消息
        

        // 监听客户端断开连接的事件
        socket.on("disconnect", function () {
            customerLeave(socket);  // 交给客服界面
        });
    });
    function whatColor(){
        if (playerlist.length==1) {
            return 1;
        }else{
            return 0;
        }
    };

    // 离客户端断开socket连接时
    function customerLeave(socket) {
        // 构造要广播给客户端的消息的数据结构
        var data = {
            type: "leave", // 用户离开
            name: socket.id
        };
        // 广播出去
        socket.broadcast.send(data);
    }
};
