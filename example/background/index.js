// 循环背景
class BackGround extends Laya.Sprite {
    constructor() {
        super();
        this.init();
    }
    init() {
 
        this.bg1 = new Laya.Sprite();
        this.bg1.loadImage("./background.png");
        this.addChild(this.bg1);

        this.bg2 = new Laya.Sprite();
        this.bg2.loadImage("./background.png");
        this.bg2.pos(0, -852);
        this.addChild(this.bg2);

        Laya.timer.frameLoop(1, this, this.onLoop);
    }
    onLoop() {
        this.y += 1;

        if (this.bg1.y + this.y >= 852) {
            this.bg1.y -= 852 * 2;
        }
        if (this.bg2.y + this.y >= 852) {
            this.bg2.y -= 852 * 2;
        }
    }
}