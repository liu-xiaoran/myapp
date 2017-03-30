(function() {
    var boxSize = 50;
    var chessSize = 40;
    var dist = 20;

    function Game(rows, cols, container) {
        this.color = null;
        this.currColor = null;

        this.cols = cols;
        this.rows = rows;

        this.container = container;
        this._renderBoard();
        this._bind();

    };

    var handler = Game.prototype;

    handler._renderBoard = function() {
        var container = this.container;
        container.addClass('container');


        var boardWidth = boxSize * (this.cols - 1),
            boardHeight = boxSize * (this.rows - 1);

        container.css({
            "width": boardWidth,
            "height": boardHeight,
            "margin": "20px",
        });
        for (var i = 0; i < (this.cols - 1) * (this.rows - 1); i++) {
            var div = $('<div/>').css({
                width: boxSize,
                height: boxSize
            });
            container.append(div);
        };

        container.css({
            position: 'relative'
        });
        var mask = this._mask = $('<div/>').addClass('.container_mask');
        mask.css({
            width: this.container.css('width'),
            height: this.container.css('height'),
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0.1
        });
        container.append(mask);
        var chess = $(".chess");
        chess.css({
            "width": boardWidth + 40,
            "height": boardHeight + 40,
        });
    };
    handler._bind = function() {
        var self = this;

        // 落子
        self._mask.on('click', function(ev) {
            // 不是我的回合，则直接返回
            if(self.color != self.currColor){
                return;
            }
            
            ev.preventDefault();

            var disX = ev.offsetX;
            var disY = ev.offsetY;

            var nextPosi = self._getNext({
                x: disX,
                y: disY
            }, dist);
            if (nextPosi) {
                console.log(nextPosi);
                var color = self.color;
                self.reqPutChess(nextPosi.x, nextPosi.y, color);
            }
        });


    };



    handler._req = function(type,data) {
        this.app.act(type,data);
    };

    handler.reqPutChess = function (x,y,color){
        var data = {
            x:x,y:y,color:color
        };
        this._req('game.putChess',data);
    };


    handler.putChess = function(x, y, color) {
        var container = this.container;
        var span = $('<span/>')
            .css({
                width: chessSize,
                height: chessSize
            })
            .css('background-color', !color ? 'black' : 'white')
            .css({
                "top": (boxSize * y - chessSize / 2) + "px",
                "left": (boxSize * x - chessSize / 2) + "px",
            });
        container.append(span);
    };

    // 页面点击坐标 找到 逻辑坐标
    handler._getNext = function(posi, dist) {
        var relaPosi = world_rela(posi);
        var list = [
            relaPosi, {
                x: relaPosi.x + 1,
                y: relaPosi.y
            }, {
                x: relaPosi.x,
                y: relaPosi.y + 1
            }, {
                x: relaPosi.x + 1,
                y: relaPosi.y + 1
            }
        ];
        var rst = list.find(function(n) {
            var worldPosi = rela_world(n);
            // console.log({posi,relaPosi,worldPosi});
            if (Math.abs(worldPosi.x - posi.x) < dist && Math.abs(worldPosi.y - posi.y) < dist) {
                return relaPosi;
            }
        });
        return rst;
    }
    var rela_world = function(posi) {
        var x = posi.x;
        var y = posi.y;
        return {
            x: x * boxSize,
            y: y * boxSize
        };
    };
    //棋盘坐标
    var world_rela = function(posi) {
        var x = posi.x;
        var y = posi.y;
        return {
            x: Math.floor(x / boxSize),
            y: Math.floor(y / boxSize)
        };
    };

    //渲染棋子

    this.Game = Game;
}).call(this);