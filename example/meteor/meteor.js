var WID = 91,
    HEI = 207;
var Browser = Laya.Browser;

class Metero extends Laya.Sprite {
    constructor() {
        super();
        this.SPEED = ~~(Math.random() * 4) + 1; //随机速度
        this.zoom = ~~(Math.random() * 5) + 2 // 随机缩小大小

        this._alpha = 1;
        this.alpha = 0;
        this.init();
    }

    init() {
        this.x = ~~(Math.random() * Browser.clientWidth) / 2; // 位置随机
        this.y = 0;
        this.renderBg();
        // 随机开始动画
        setTimeout((function() {
            this.start();
        }).bind(this), ~~(Math.random() * 10) * 500);
    }

    renderBg() {
        var sp = new Laya.Sprite();

        sp.loadImage('./meteor.png', 0, 0,
            WID / this.zoom,
            HEI / this.zoom);

        this.addChild(sp);
    }

    animation() {
        this.y += this.SPEED;
        this.x += this.SPEED * WID / HEI;

        this._alpha = this._alpha - this.SPEED * 0.0015;
        this.alpha = this._alpha;

        if (this.y > Browser.clientHeight || this.x > Browser.clientWidth) {
            this.stop();
        }
    }
    stop() {
        this.destroy();
        Laya.timer.clear(this, this.animation);
    }
    start() {
        Laya.timer.frameLoop(1, this, this.animation);
    }
}

class MeteroManager extends Laya.Sprite {
    constructor() {
        super();
    }
    play(size = 10) {
        for (var i = 0; i < size; i++) {
            var item = new Metero();
            this.addChild(item)
        }
    }
}