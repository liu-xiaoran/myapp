/**
 * Created by hxsd on 2017/2/16.
 */

var data=[
    {
        "color":0,
        "posArr":[
            {x:7,y:7},
            {x:1,y:1},
            {x:2,y:3},
            {x:3,y:4},
            {x:7,y:4},
            {x:6,y:5},
            {x:4,y:7},
            {x:3,y:9},
            {x:6,y:6},
            {x:4,y:5},
            {x:6,y:7},
            {x:1,y:4},
            {x:2,y:4},
            {x:5,y:4},
            {x:8,y:4},
            {x:3,y:6},
            {x:3,y:5},
            {x:2,y:6}
        ]
    },
    {
        "color":1,
        "posArr":[
            {x:1,y:1},
            {x:2,y:4}
        ]
    }
];

var row=10;
var col=10;

module.exports={
    //定义棋盘大小
    boxSize:function(){
        return {
            row:row,
            col:col
        };
    },
    checkWin:function(data){
        if(wuzi(data[0].posArr)){
            return data[0].color;
        }else if(wuzi(data[1].posArr)){
            return data[1].color;
        };
        //和棋
        if(data[0].posArr.length+data[1].posArr.length==row*col){
            return 2;
        };
        return 3;
    }
};

//五子相连
function wuzi(posArr){
    if(posArr.length<5){
        return false;
    };
    posArr.sort(sortPosX);
    for(var i=0;i<posArr.length;i++){
        console.log("x:"+posArr[i].x+",y:"+posArr[i].y);
    };
    var firstX=posArr[0].x;
    var firstY=posArr[0].y;
    var num=1;

    //横向
    for(var i=1;i<posArr.length;i++){
        if(posArr[i].y==firstY && posArr[i].x==firstX+num){
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

    //左上到右下
    for(var i=1;i<posArr.length;i++){
        num=1;
        for(var j=i;j<posArr.length;j++){
            if(posArr[j].x==posArr[i].x+num && posArr[j].y==posArr[i].y+num){
                num++;
                if(num==5){
                    return true;
                };
            };
        };
    };

    //右上到左下
    for(var i=1;i<posArr.length;i++){
        num=1;
        for(var j=i;j<posArr.length;j++){
            if(posArr[j].x==posArr[i].x-num && posArr[j].y==posArr[i].y+num){
                num++;
                if(num==5){
                    return true;
                };
            };
        };
    };

    //纵向
    posArr.sort(sortPosY);
    console.log("---------------------------------------------");
    for(var i=0;i<posArr.length;i++){
        console.log("x:"+posArr[i].x+",y:"+posArr[i].y);
    };
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
function sortPosX(a,b){
    switch(true){
        case a.y<b.y:return -1;
        case a.y>b.y:return 1;
        case a.x<b.x:return -1;
        case a.x>b.x:return 1;
    };
};

//按Y排序
function sortPosY(a,b){
    switch(true){
        case a.x<b.x:return -1;
        case a.x>b.x:return 1;
        case a.y<b.y:return -1;
        case a.y>b.y:return 1;
    };
};
console.log(wuzi(data[0].posArr));