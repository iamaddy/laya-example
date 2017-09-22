var WID = 320,
    HEI = 60;

function Item() {
    Item.__super.call(this);
    this.size(WID, HEI);
    this.graphics.drawRect(0, 0, WID, HEI, '#0c969a', '#00dae2', 0.5);

    this.img = new Laya.Image();
    this.img.width = 40;
    this.img.height = 40;
    this.img.x = 50;
    this.img.y = 20 / 2;

    this.addChild(this.img);

    this.setImg = function(src) {
        this.img.skin = src;
    }
    this.setNick = function(nick) {
        this.nick.text = nick;
    }

    this.setData = function(data) {
        this.scoreText.text = data.score + '分';
        this.nickText.text = data.nick + '';
        this.img.skin = data.src;
        this.indexText.text = data.index;
    }
    this.setScore = function(score) {
        this.score.text = score;
    }

    this.indexText = new Laya.Text();
    this.indexText.overflow = Laya.Text.HIDDEN;
    this.indexText.color = "#82b9c7";
    this.indexText.fontSize = 36;
    this.indexText.x = 10;
    this.addChild(this.indexText);

    this.nickText = new Laya.Text();
    this.nickText.overflow = Laya.Text.HIDDEN;
    this.nickText.color = "rgba(255, 255, 255, 0.5)";
    this.nickText.fontSize = 14;
    this.nickText.x = 100;
    this.nickText.y = 20;
    this.addChild(this.nickText);

    this.scoreText = new Laya.Text();
    this.scoreText.overflow = Laya.Text.HIDDEN;
    this.scoreText.color = "rgba(255, 255, 255, 0.5)";
    this.scoreText.fontSize = 14;
    this.scoreText.x = 280;
    this.scoreText.y = 20;

    this.addChild(this.scoreText);
}

Laya.class(Item, "Item", Laya.Box); // 只要是Laya中可绘制的容器就行，Sprite也可以


class UIList extends Laya.Sprite {
    constructor() {
        super();
        this.init();
        this.initData();
    }
    initData() {
        var data = [{
            "index": 1,
            "score": 99,
            "nick": "xxx",
            "src": "http://wx.qlogo.cn/mmhead/erdPPfGy5NRglm3R8sXV192YQqa8THUjyoR6IbTR4hg/0"
        }, {
            "index": 2,
            "score": 42,
            "nick": "ziming",
            "src": "http://wx.qlogo.cn/mmhead/ajNVdqHZLLBBdCMvxiaL2g1tyuMglnRqicYnBcsME4FC8GWGsqKdh3GQ/0"
        }];

        for (var i = 0; i < 10; i++) {
            var d = Object.assign({}, data[1]);
            d.index = 3 + i;
            data.push(d);
        }
        this.list.array = data;
    }
    init() {
        var list = new Laya.List();
        list.itemRender = Item;

        list.repeatX = 1; // 显示列数
        list.repeatY = 4; // 显示行数

        // 使用但隐藏滚动条
        list.vScrollBarSkin = "";

        //list.selectEnable = true;
        //list.selectHandler = new Laya.Handler(this, onSelect);

        list.renderHandler = new Laya.Handler(this, this.updateItem);

        this.addChild(list);
        this.list = list;
        list.x = 25;
        list.y = 50;
    }
    updateItem(cell, index) {
        // cell 为Item的实例化对象
        cell.setData(cell.dataSource);
    }
}