var gameConfig=require("./gameConfig");

function Game(cols,rows){
	this.cols = cols;
	this.rows = rows;

	this._map = {
		0:[],
		1:[]
	};

	this.winColor = undefined;
	this._startGame();
};


var handler = Game.prototype;

handler.putChess = function(x,y){
	this._setChess(x,y);

	var winColor = this._check();
	//if(!this.winColor){
	if(winColor==undefined){
		this._switchColor();
	}else{
		this.winColor=winColor;
	};
};

handler.isCurrColor = function(color){
	if(color == this.currColor){
		return true;
	};
	return false;
};

handler.isExist = function(x,y){
	var arr=this._map[0].concat(this._map[1]);
	for(var i=0;i<arr.length;i++){
		if(arr[i].x+""+arr[i].y==x+""+y){
			return true;
		};
	};
	return false;
};

// private methods
handler._check = function(){
	if(_wuzi(this._map[this.currColor])){
		return this.currColor;
	};
};

handler._switchColor = function(){
	this.currColor = 1 - this.currColor;
};

handler._startGame = function () {
	this.currColor = gameConfig.COLOR.BLACK;
};

handler._setChess = function(x,y){
	//this._map[[x,y].join('#')] = this.currColor;
	this._map[this.currColor].push({x:x,y:y});
};

handler._getChess = function(x,y){
	return this._map[[x,y].join('#')];
};

//五子相连
function _wuzi(posArr){
	if(posArr.length<5){
		return false;
	};
	posArr.sort(_sortPosX);
	var firstX=posArr[0].x;
	var firstY=posArr[0].y;
	var num=1;

	//横向
	for(var i=1;i<posArr.length;i++){
		if(posArr[i].y==firstY && posArr[i].x==firstX+num){
			num++;
			console.log("num:"+num);
			if(num==5){
				return true;
			};
		}else{
			num=1;
			firstX=posArr[i].x;
			firstY=posArr[i].y;
		};
	};

	//左上到右下
	for(var i=0;i<posArr.length;i++){
		num=1;
		for(var j=0;j<posArr.length;j++){
			if(posArr[j].x==posArr[i].x+num && posArr[j].y==posArr[i].y+num){
				num++;
				if(num==5){
					return true;
				};
			};
		};
	};

	//右上到左下
	for(var i=0;i<posArr.length;i++){
		num=1;
		for(var j=0;j<posArr.length;j++){
			if(posArr[j].x==posArr[i].x-num && posArr[j].y==posArr[i].y+num){
				num++;
				if(num==5){
					return true;
				};
			};
		};
	};

	//纵向
	posArr.sort(_sortPosY);
	firstX=posArr[0].x;
	firstY=posArr[0].y;
	num=1;
	for(var i=1;i<posArr.length;i++){
		if(posArr[i].x==firstX && posArr[i].y==firstY+num){
			num++;
			if(num==5){
				return true;
			};
		}else{
			num=1;
			firstX=posArr[i].x;
			firstY=posArr[i].y;
		};
	};
	return false;
};

//按X排序
function _sortPosX(a,b){
	switch(true){
		case a.y<b.y:return -1;
		case a.y>b.y:return 1;
		case a.x<b.x:return -1;
		case a.x>b.x:return 1;
	};
};

//按Y排序
function _sortPosY(a,b){
	switch(true){
		case a.x<b.x:return -1;
		case a.x>b.x:return 1;
		case a.y<b.y:return -1;
		case a.y>b.y:return 1;
	};
};

module.exports = Game;
