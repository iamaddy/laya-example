# Laya 开发过程中的注意点


总结下近期用Laya开发游戏中遇到的一些问题。

### 1、继承Sprite类

继承精灵类后不能定义render方法，会覆盖父类的方法，导致渲染不出来。 

```
class EnergyPoint extends Laya.Sprite{
	render(){
	}
}
```

### 2、图片的尺寸

提前预加载的资源才可以获得图片的尺寸。

```
// 预加载
var urls = ['./monkey.png'];
Laya.loader.load(
    [{
        url: urls,
        type: Laya.Loader.IMAGE
    }],
    Laya.Handler.create(this, showHandling)
);


// 不提前加载则为0
this.monkey = new Laya.Image();
this.monkey.skin = ("./monkey.png");
console.log(this.monkey.width, this.monkey.height);
```

子元素的宽高不会把父元素撑开

```
this.monkey = new Laya.Sprite();
this.monkey.loadImage("./monkey.png");
this.addChild(this.monkey);
console.log(this.width, this.height); // 0, 0
```
### 3、事件

如果对象没有宽高，点击事件也无法触发。

```
this.on('click', this, this.clickThis1)

clickThis1(){
	console.log(2); // 不会打印2
}
```

子元素的点击事件会冒泡到子元素上。

```
this.monkey.on('click', this, this.clickThis);
this.on('click', this, this.clickThis1);
clickThis(){
    console.log(1); // 1
}
clickThis1(){
    console.log(2); // 2
}
```

mouseup、mousedown等事件在移动端会默认转换为touch对应的事件。

### 4、多倍图

主要为retina屏幕的表现，原理同html。如果是2倍图，那么就需要设计屏幕尺寸2倍大小的图片。但是laya实际上绘制的时候是以设备的物理尺寸绘制的，所以在绘制图片的时候，需要缩放原来的尺寸。否则看起来就很大。https://wximg.qq.com/wxgame/bottlefly/feichuang2/1.png这张图片的实际大小是86*106，最终被绘制的大小是43,53。除了这样还可以设置Sprite的scale大小为0.5。

```
var sp = new Laya.Sprite();
sp.graphics.loadImage(
    'https://wximg.qq.com/wxgame/bottlefly/feichuang2/1.png',
    0,
    0,
    43,
    53
);
Laya.stage.addChild(sp);
```

![Alt text](https://iamaddy.github.io/img/3.png)

图片的实际尺寸是上面的2倍，如果不缩放宽高，则会很大，在高分辨率手机上看起来就糊掉。

![Alt text](https://iamaddy.github.io/img/4.png)

### 5、removeSelf和destroy的区别

什么时候会用到这个两个函数呢？当我们切换场景，或者用到的绘制对象不再需要的时候可以销毁它，释放内存。

因此Sprite、Graphics等对象都是继承Node类。Node 是laya的一个基类。Node类是可放在显示列表中的所有对象的基类。该显示列表管理 Laya 运行时中显示的所有对象。使用 Node 类排列显示列表中的显示对象。Node 对象可以有子显示对象。

```
/**
 * 从父容器删除自己，如已经被删除不会抛出异常。
 * @return 当前节点（ Node ）对象。
 **/
 __proto.removeSelf=function(){
     this._parent && this._parent.removeChild(this);
     return this;
 }

/**
  *<p>销毁此对象。destroy对象默认会把自己从父节点移除，并且清理自身引用关系，等待js自动垃圾回收机制回收。destroy后不能再使用。</p>
  *<p>destroy时会移除自身的事情监听，自身的timer监听，移除子对象及从父节点移除自己。</p>
  *@param destroyChild （可选）是否同时销毁子节点，若值为true,则销毁子节点，否则不销毁子节点。
  */
__proto.destroy=function(destroyChild){
    (destroyChild===void 0)&& (destroyChild=true);
    this.destroyed=true;
    this._parent && this._parent.removeChild(this);
    if (this._childs){
        if (destroyChild)this.destroyChildren();
        else this.removeChildren();
    }
    this._childs=null;
    this._$P=null;
    this.offAll();
    this.timer.clearAll(this);
}
```
代码注释说明的很清楚了，destroy做的事情多多了，包括对象上的事件和事件监听器都会被移除。因为真正要释放一个显示对象，则用destroy。

### 6、Laya 缓动

跟其他的缓动没有什么区别，只不过要注意下使用，官方文档没有说的很清楚。

To和from方法是提供渐变的，一个是到目标属性，一个是到目标属性。

```
to(target:*, props:Object, duration:int, ease:Function = null, complete:Handler = null, delay:int = 0, coverBefore:Boolean = false, autoRecover:Boolean = true):Tween
```

Laya.Tween.to会返回一个tween实例对象。

```
this.moveBackgroundTween = Laya.Tween.to(this, {
    y: this.y + 300
}, 5000, 
Laya.Ease.linearNone,
Laya.Handler.create(this, this.moveBackGroundEnd, [this])
);

// 如果中途要停止的话，pause。

this.moveBackgroundTween.pause();

// Clear 方法直接清除掉缓动，也会立马停止当前的缓动。会将当前的对象从缓动中移除，并且清除掉计时器任务。
this.moveBackgroundTween.clear();
```

### 7、HitArea

设置一块区域作为精灵的点击区域。

本来精灵的点击区域是他自身，如果设置HitArea，那么原来的区域则不可点击，创建的新的hitArea才能发生点击。

```
var hitArea = new Laya.HitArea();
var graphics = new Laya.Graphics();
graphics.drawRect(100,100,100,100,"#ff9900");
hitArea.hit = graphics;
this.monkey.hitArea = hitArea;
```

8、Graphics

绘制矢量图形的类。
填充色居然没有透明色，设置alpha，则会整体透明。需要绘制一个圆环都很费劲，可能还是没找到正确的接口。后来发现fillColor可以传递rgba(255,255,255,0)色值，算是一种hack方法。


未完待续。



