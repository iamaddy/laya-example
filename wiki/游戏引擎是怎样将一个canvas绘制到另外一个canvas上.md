# 游戏引擎是怎样将一个canvas绘制到另外一个canvas上

canvas 中画另外一个canvas，在原生的接口里面有一种方法

### 接口
```
void ctx.drawImage(image, dx, dy);
void ctx.drawImage(image, dx, dy, dWidth, dHeight);
void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
```

绘制到上下文的元素。允许任何的 canvas 图像源(CanvasImageSource)，例如：HTMLImageElement，HTMLVideoElement，或者 HTMLCanvasElement。

同样canvas.toDataURL()返回的是base64的图片，把这个绘制到canvas，接口用的还是一样的。

### Laya
找了半天文档终于发现一个看起来可行的方法
Texture 是一个纹理处理类。
有一个bitmap 属性，可以是图片或者canvas 。

```
var _texture = new Laya.Texture(canvas);
```

但实际发现确实不行的，因为这个canvas不是普通的canvas。而是Laya自定义的一个类Laya.HTMLCanvas。
所以要转变下思路，将原生的canvas转换为HTMLCanvas。

```
function createCanvas(canvasWidth, canvasHeight) {
    var canvas = Laya.HTMLCanvas.create("2D");
    var context = new Laya.RenderContext(canvasWidth, canvasHeight, canvas);
    return canvas;
}
```

这样就能将其绘制到主canvas上

```
var _canvas = createCanvas(config.GameWidth, config.GameHeight);
var childSp = new Laya.Sprite();
var _texture = new Laya.Texture(_canvas);
Laya.stage.addChild(childSp);
```

### Cocos
cocos引擎支持的比较好，只需要简单的方法搞定

```
var sp = new cc.Sprite(sharedCanvas)
sp.setAnchorPoint(0, 0)
sp.x = 0
sp.y = 0

this.addChild(sp)
```

canvas是Sprite的入参，即可绘制在主canvas上。

### 两个canvas同步绘制

无论两种引擎的方法怎样，最终的实现肯定是drawImage，这是一个绘制静态的图片的方法，我们绘制的内容永远只有子canvas的的一帧。那么有什么方法可以同步两个canvas的绘制呢？

方法是，控制两个canvas的引擎都同时绘制。A在绘制的时候，B也在绘制，只要A同步绘制B的结果就好：

在laya中：

```
Laya.timer.frameLoop(1, this, function() {
    childSp.texture = _texture;
});
```

写一个定时器，不断的重新设置新的纹理就好。这样B的绘制结果就是即时同步绘制在A上面。