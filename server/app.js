var socketIO = require("socket.io");
var Game = require("./game");
var CONFIG = require("./gameCONFIG");
var express = require("express");
var http = require("http");
var _ = require('underscore');

var port = 3000;

var App = function() {
	this.userList = [];
	this.init();
	this.bind();
};

var handler = App.prototype;

handler.init = function() {
	// var app = express();
	var httpServer = http.createServer( /*app*/ );
	var io = this.io = socketIO.listen(httpServer);

	httpServer.listen(port, function() {
		console.log("服务器正运行在" + port + "端口...");
	});
};

// todo
handler.bind = function() {
	var self = this;
	var io = self.io;

	var dict = {};
	// enter
	dict['user.enter'] = function(so, data) {
		let username = data.username;
		if (!this._findUser(username)){
			this._addUser(so.id,username);

			let us = this._findUserBySid(so.id);
			let color = us.color;
			username = us.username;
			io.send({
				type: 'user.join',
				username,
				color
			});
		}

		// 人数满足
		console.log(this.userList.length);
		if (this.userList.length == CONFIG.USER_COUNT) {
			this.startGame();
			var ga = this.game;
			io.send({
				type: 'game.start',
				userList: this.userList,
				cols: ga.cols,
				rows: ga.rows
			});

			console.log(this.userList);
			io.send({
				'type':'game.currColor',
				'color':ga.currColor
			});
			
			// setInterval(()=>{
			// 	io.send({
			// 		type: 'game.start',
			// 		userList: this.userList,
			// 		cols: ga.cols,
			// 		rows: ga.rows
			// 	});

			// },2000)
		}
	};

	// putChess
	dict['game.putChess'] = function(so,data){
		let ga = this.game;
		let {x,y,color} = data;
		
		// color check
		if(ga.currColor !== color){
			return;
		}

		ga.putChess(x,y);

		io.send({type:'game.putChess',x,y,color});

		// 是否有胜负
		if(ga.winColor!=undefined){
			let data ={
				type:'game.end',
				color:ga.winColor
			};
			io.send(data);
		}else{
			io.send({
				'type':'game.currColor',
				'color':ga.currColor
			});
		}

	};

	io.on("connect", function(so) {
		console.log(so.id);
		console.log(io.emit+'');
		console.log('$$$$$$$$$$$$$$$$$$$$$$')
		console.log(io.sockets.emit+'');
		console.log(io.emit === io.sockets.emit);
		so.on('message', function(data) {
			console.log(data, new Date().toString());

			var type = data.type;
			dict[type] && dict[type].call(self, so, data);
		});

		so.on('disconnect', function() {
			console.log('before',this.userList);
			console.log('_removeUserBySid:',so.id);
			let us = this._findUserBySid(so.id);

			if(us){
				this._removeUserBySid(so.id);
				console.log('after',this.userList);
				
				io.send({
					'type':'user.leave',
					'username':us.username
				});
			}
		}.bind(self));
	});


};


handler.startGame = function() {
	var rows = CONFIG.rows,
		cols = CONFIG.cols;

	var ga = this.game = new Game(rows, cols);
	// console.log('game:',ga);
};

// private methods
// todo
handler._getColor = function() {
	return this.userList.length == 0 ? 0:1;
};

handler._addUser = function(sid, username) {
	color = this._getColor();
	console.log({color});
	this.userList.push({
		sid,
		username,
		color
	});
};

handler._findUser = function(username){
	return _.find(this.userList,us=>us.username == username);
};

handler._findUserBySid = function(sid){
	return _.find(this.userList,us=>us.sid == sid);
};

handler._removeUserBySid = function(sid){
	this.userList = _.filter(this.userList,us=>us.sid!=sid);
};

var app = new App();


module.exports = app;