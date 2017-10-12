# Cocos  Creator 与Laya开发差异

为了适配微信小程序开发，需要改引擎的代码，大概40处左右，主要是将DOM和BOM操作的相关接口改掉。

cocos体系和Laya体系还是很不一样的。

## 坐标系

坐标系相差太远。laya是完全以屏幕左上角为坐标原点，x向右，y向下，但Cocos  Creator坐标系和 OpenGL 坐标系一样，原点为屏幕左下角，x 向右，y 向上。

![xx](https://iamaddy.github.io/img/screen_vs_world.png)

因此如果在Laya中实现的游戏搬到Cocos中来，坐标这一块会令人头疼。

## 锚点

锚点位置确定后，所有子节点就会以锚点所在位置作为坐标系原点，注意这个行为和 cocos2d-x 引擎中的默认行为不同，是 Cocos Creator 坐标系的特色！

![Alt text](https://iamaddy.github.io/img/1.png)

而且IDE默认的锚点是0.5，0.5，所以锚点的位置是精灵的中间位置，而他的子节点将会以中间这个点作为坐标原点。如果要将他的某一个子元素放到下面，则需要设置x/y为负值。

## 渲染差异

laya中一切以Sprite为基础，Sprite也是容器，可以装载其他组件。

但是cocos却不同，他是以Node节点为基础。Node节点的child只能是Node，不能是Sprite等实例。而且Sprite负责渲染逻辑，Node只是容器，而且Node只能包含一个Sprite组件。

```
let node = new cc.Node();
var timer = node.addComponent(cc.Sprite);

node.x = 252/2;
node.y = 502/2;

node.scaleX = 0.5;
node.scaleY = 0.5;
var imgUrl = cc.url.raw('Texture/num_3.png');
var texture = cc.textureCache.addImage(imgUrl);
// 创建渲染图片资源
timer.spriteFrame = new cc.SpriteFrame();
// 绑定纹理
timer.spriteFrame.setTexture(texture);	

return node;
```

cocos渲染一个组件的方法真是太婆妈了，写了一坨代码只是为了渲染一张图片。Laya却很简单

```
var img = new Laya.Sprite();
img.loadImage('imgurl', x, y, width, height);
```

Laya简单优雅。

Graphics绘图类也不太一样。感觉还是Laya的接口会比较简单优雅。

同样是绘制矩形，cocos要写很多代码

```
var node =  new cc.Node();
let cell = node.addComponent(cc.Graphics);
node.active = false;

node.width  = 23;
node.height = 23;

if(bg === '#000'){
	var color = cc.Color.BLACK;
}else{
	color = bg;
}
cell.fillColor = color;
cell.fillRect(
          0,
          0,
          node.width,
          node.height
      );

cell.strokeColor = cc.Color.WHITE;
cell.lineWidth = 2;
cell.rect(
          2,
          2,
          node.width - 4,
          node.height - 4
      );
cell.stroke();

return node;
```

laya却比较简单

```
let cell = new Laya.Sprite();
cell.visible = false;
cell.width  = 23;
cell.height = 23;

cell.graphics.drawRect(
      0,
      0,
      cell.width,
      cell.height,
      bg
  );

cell.graphics.drawRect(
      2,
      2,
      cell.width - 4,
      cell.height - 4,
      bg,
      "#fff",
      2
  );

  return cell;
}
```


## IDE差异

IDE的好用，肯定是cocos胜出不少，体验比较好，简单的拖拽就能画了一个场景了，相比Laya的还是要好很多，上手程度也要容易很多。

## 其他区别

Laya中主角是Stage舞台。只有一个。
cocos中主角是Scene。可以多个。
其实两者都差不多，作为主要的基础容器，装载元素。
场景过渡的方法不一样。Laya中的最后被添加的元素添加到最上层。所以只要控制场景的层级就好。

cocos需要接口过渡场景

```
cc.director.loadScene("helloworld");
```
## 后续
关于其他的区别，后续使用到再归纳。

晒一下工作3天的成果
![Alt text](https://iamaddy.github.io/img/2.png)
