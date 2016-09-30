---
layout: post
title: JavaScript设计模式（二）
published: true
---

本文承接上一篇[JavaScript设计模式（一）](https://chenjin3.github.io/JavaScript%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F-%E4%B8%80/)，继续介绍其他常用的设计模式。

## 索引
### JavaScript设计模式(一) 

* [原型模式](https://chenjin3.github.io/JavaScript%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F-%E4%B8%80/#section-7)
* [工厂模式](https://chenjin3.github.io/JavaScript%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F-%E4%B8%80/#section-9)
* [迭代器模式](https://chenjin3.github.io/JavaScript%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F-%E4%B8%80/#section-13)
* [职责链模式](https://chenjin3.github.io/JavaScript%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F-%E4%B8%80/#section-15 "职责链模式与电商预购应用")
* [命令模式](https://chenjin3.github.io/JavaScript%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F-%E4%B8%80/#section-16)
* [策略模式](https://chenjin3.github.io/JavaScript%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F-%E4%B8%80/#section-18)

### JavaScript设计模式（二）
#### 包装模式

* [单例模式](#section-4)
* [代理模式](#section-5)
* [装饰者模式](#section-6)
* [适配器模式](#section-7)
* [外观模式](#section-8)

#### 一对多关系

* [观察者模式](#section-9)
* [中介者模式](#section-10)

#### 其他

* [模板方法模式](#section-11)
* [组合模式](#section-12)
* [状态模式](#section-13)
* [享元模式](#section-14)

## 单例模式
单例模式和原型模式、工厂模式一样，也是用于对对象的创建过程进行了抽象，将软件模块中对象的创建和对象的使用分离，使整个系统的设计更加符合单一职责原则。
单例模式确保在系统中一个构造器仅有一个实例，并提供全局访问。它可以在合适的时候创建唯一的一个对象。全局变量不是单利模式，但在JavaScript中，我们经常把带命名空间的全局变量当单例来使用，如下所示。

```
var myApp = {
   a: new function(){
       console.log("I'm a");
   },
   b: new function(){}
};
var variable1 =  myApp.a;
var variable2 =  myApp.a;
console.log(variable1 == variable2); //true
```
虽然这种全局变量也可以提供唯一的对象供全局访问，但这个对象会在页面一加载好的时候就创建，而不是在需要的时候才创建对象实例。这时候就需要单例模式的惰性加载能力。

例如我们要开发系统的登录功能。当用户单击登录按钮时，需要显示一个登录浮窗。
一种解决方案是在页面加载完成时就创建好这个登录浮窗，但处于隐藏状态，当用户点击登录按钮时它才显示。这种方式有一个问题，有可能用户只是到该网站浏览一些公开的信息，并不想登录。这种一开始就创建登录浮窗的方式可能白白浪费了一些DOM节点。
我们可以使用惰性单例在用户点击登录按钮的时候才开始创建该浮窗。如下所示。

```
//管理单例
var getSingleton = function ( fn ) {
   var ret; //闭包环境中的私有变量
   return function () {
       return ret || (ret = fn.apply(this, arguments));
   };
};
//创建对象
var createLoginLayer = function() {
   var div = document.createElement('div');
   div.innerHTML = '我是登录浮窗';
   div.style.display = 'none';
   document.body.appendChild(div);
   return div;
};
//createSingletonLoginLayer是createLoginLayer的代表：代理模式
var createSingletonLoginLayer = getSingleton(createLoginLayer);

var loginLayer1 = createSingletonLoginLayer();
var loginLayer2 = createSingletonLoginLayer();
console.log( loginLayer1 === loginLayer2 );//    true

document.getElementById( 'loginBtn' ).onclick = function() {
   var loginLayer = createSingletonLoginLayer();
   loginLayer.style.display = 'block';
}
```
getSingleton函数管理单例，保证了创建的登录浮窗的DOM实例是唯一的，避免了在页面上创建多个登录浮窗的可能。在这个例子中,我们把创建实例对象的职责和管理实例的职责分别放在两个函数里,这两个函数可以独立变化而互不影响。getSignleton函数作为其参数fn函数的代理，控制创建对象函数的访问，保证了创建对象函数createLoginLayer只执行一次。这也体现了下面要介绍的另一个模式：代理模式。

## 代理模式
代理模式为一个对象提供一个替身或占位符以控制对这个对象的访问。代理对象将对象的访问控制的职责分离出来，控制和管理访问。
代理的方式有许多种，虚拟代理（Virtual Proxy）控制访问创建开销大的资源，缓存代理（Catching Proxy）减轻资源访问的压力，保护代理（Protection Proxy）基于权限或频率控制对资源的访问，远程代理（Remote Proxy）控制远程对象的访问。
使用代理模式创建代表（representative）对象，代表对象通常和实际对象有相同的接口。在JavaScript中，我们不需要向Java等面向对象语言中那样实现同一个接口，但需要程序猿自觉保证代理类和本体类的函数接口一致。

### 虚拟代理应用：图片预加载
虚拟代理控制访问创建开销大的资源。之所以称为虚拟代理，是因为虚拟代理作为本体对象的代表，在本体对象还不存在的时候就可以调用，虚拟代理还经常负责创建本体对象。虚拟代理把一些开销很大的对象，延迟到真正需要它的时候才去创建。

在前端开发中,图片预加载是一种常用的技术,如果直接给某个img标签设置src属性, 由于图片过大或者网络不佳,图片的位置往往有段时间会是一片空白。常见的做法是先用一张loading图片占位,然后用异步的方式加载图片,图片加载好了再把它填充到img节点上,这种场景很适合使用虚拟代理。代码如下：

```
 //本体对象，负责给给img节点设置src
    var myImage = (function(){
        var imgNode = document.createElement( 'img' );
        document.body.appendChild( imgNode );
        return {
            setSrc: function( src ){
                imgNode.src = src;
            }
        }
    })();
    //myImage的代理接口，负责预加载图片
    var proxyImage = (function(){
        var img = new Image();
        img.onload = function(){   //真实图片下载完成
            myImage.setSrc( this.src );//设置真实图片
        }
        return {
            setSrc: function( src ){
                myImage.setSrc( '/image/loading.gif');//设置占位符
                img.src = src;  //开始下载真实图片
            }
        }
    })();
    proxyImage.setSrc( 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png' );
```

这里通过proxyImage间接访问MyImage，proxyImage控制了客户对MyImage的访问，并负责在真正的图片加载好之前，先把img节点的src设置为一张本地的loading图片。

### 虚拟代理应用：合并http请求
在Web开发中，也许最大的开销就是网络请求。假设我们要做一个文件同步的功能。每当选中图书列表页面中一个checkbox，它对应的文件就会被同步到另外一台备用服务器上面。实现如下：

```
var syncFile = function(id) {
        console.log('开始同步文件, id为：' + id);//模拟网络请求
}
var $fileList = document.getElementById('file-list');
$fileList.onclick = function(e) { //事件委托
        var event = e || window.event;
        var target = event.target || event.srcElement;
        if(target.nodeName.toLowerCase() == 'input') {
            if(target.checked == true) {
                syncFile(target.id);
            }
        }
};
```
可以预见，如果用户快速点击很多复选框，前端会依次发送一系列http请求给服务器，如此频繁的网络请求将会带来相当大的开销。解决方案是我们可以通过一个代理函数来手机一段事件之内的请求，最后依次性发送给服务器。代码实现如下：

```
//代理模式
var proxySyncFile = (function() {
   var cache = [], //保存一段事件内需要同步的ID
       timer;
   return function(id) {
       cache.push(id);
       if(timer) { //不覆盖已启动定时器
           return;
       }
       timer = setTimeout(function() {
           syncFile(cache.join(',')); //向本体发送需要同步的ID集合
           clearTimeout(timer);
           timer = null;
           cache.length = 0; //清空缓存
       },2000);
   }
})();
var $fileList = document.getElementById('file-list');
$fileList.onclick = function(e) {
   var event = e || window.event;
   var target = event.target || event.srcElement;
   if(target.nodeName.toLowerCase() == 'input') {
       if(target.checked == true) {
           proxySyncFile(target.id);
       }
   }
};
```
proxySyncFile函数通过定时器实现了将每2秒钟间隔内，需要同步的文件ID打包发给服务器。如果不是实时性要求非常高的系统，2秒的延迟不会打来太大问题，却能大大减轻服务器的压力。

### 缓存代理
缓存代理可以为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传入的参数和之前一致，则可以直接返回前面存储的运算结果。这样缓存计算结果降低了CPU资源的消耗。还可以缓存数据库或文件中的数据，以降低数据库访问压力和IO压力。而缓存网络请求到的数据，可以节省网络请求，降低服务器的压力，提高用户体验。

### 保护代理
保护代理用于保护对象的访问。试想精通设计模式的你正好需要找一份更好更高薪的工作，而你又不想让大量潜在雇主或猎头的电话直接打到你的办公室。于是你找来一个经纪人，如同保护代理，经纪人帮你打发掉那些只打算给出比你现在薪水多15%的雇主，只让某些电话打进来给你。
再比如你经常被手机app的推送消息所打扰，这时你需要一个勿扰模式的代理服务让某个时间段内所有消息通知都不会显示。这个保护代理的代码看起来可能是像下面这样的。

```
var Inbox = function() {
	//creation
}
Inbox.prototype = {
	showMessage: function(...){
		//show a message to you from inbox using thie given parameters
	},
	search: function(...){
	   // // search through the messages using the query
	},
	...
};
var InboxProxy = function() {
	this.inbox = null;
	this.doNotDisturb = false;
};
InboxProxy.prototype = {
	getDoNotDisturb: function() {
		return this.doNotDisturb;
	},
	setDoNotDisturb: function() {
		this.doNotDisturb = ! this.doNotDisturb;
	},
	_init: function() {
		if(! this.doNotDisturb && !this.index) {
			this.inbox = new Inbox();
			return true;
		}
		return false;
	},
	showMessage: function(...) {
		return this._init() && this.inbox.showMessage(...);
	},
	search: function(...) {
		return this._init() && search(...);
	},
	...	
}

```

### 远程代理
在客户端的JavaScript中，我们很少访问服务器端的JavaScript对象上的方法。前端程序作为后端服务的代理，远程代理常常体现为前端JavaScript函数封装了后端Web Service的API，通过ajax等方式进行网络请求，实现对远程数据模型的代理访问。当然随着Node.js的流行，访问远程的JavaScript对象的方法也变得可能。实现可以参考异步RPC类库[Dnode](https://github.com/substack/dnode)的应用示例和实现。

面向对象设计鼓励将行为分布到细粒度的对象中，将对象的访问控制的职责划分出来，放到代理对象中，符合单一职责原则，有助于实现低耦合易维护的系统。如果以后不需要访问控制了，可以直接使用本体对象，而不必修改本体对象，因此采用代理模式的设计也符合开放封闭原则。我们注意到代理对象和本体对象的接口通常是一致的，以至于用户可能并不清楚他使用的是本体对象还是代理对象。代理模式常用于控制访问开销大的资源，保护对象在某些情况下不会被非法访问，以及缓存运算结果，减少计算或网络延迟。代理对象通常包装了本体对象，控制对象的访问。而装饰者模式为对象增加行为。

## 装饰者模式
装饰者模式为对象增加行为。它将一个对象嵌入另一个对象之中，相当于这个对象被另一个对象包装起来，形成一条包装链。请求随着这条链依次传递到所有对象，每个对象都有处理请求的机会。
在JavaScript中，几乎一切都是对象，其中函数又被称为一等对象。要在JavaScript中实现装饰者模式，就是要给函数添加额外的功能。为了不破坏程序的可维护性，我们不能违反开放封闭原则。也就是要在不改动函数体的情况下给函数动态增加功能。我们可以使用AOP(面向方面编程)来装饰函数，达到这个目的，实现如下所示。

```
//被装饰的函数对象
window.onload = function(){
   alert (1);
}
Function.prototype.before = function( beforefn ) {
   var __self = this;
   return function() {
       beforefn.apply(this, arguments );//先执行传入的装饰函数
       return __self.apply( this, arguments );//执行原函数
   }
}
Function.prototype.after = function( afterfn ) {
        var __self = this;
        return function(){
            var ret = __self.apply(this, arguments);
            afterfn.apply( this, arguments );
            return ret;
        }
};

var originFun = window.onload || function(){};
window.onload = (originFun).before(function() {
      alert ("前置装饰");
}).after(function() {
	    alert ("后置装饰");
});
```

Function.protyotype.before接受一个函数当做参数，这个函数装载了新添加的功能代码。接下来把当前的this保存起来，这个this指向原函数，然后返回一个新函数，这个函数负责把请求转发给新添加的函数和原函数，且负责保证他们的执行顺序，让新添加的函数在原函数之前执行，这样就实现了动态装饰的效果。

### 装饰者模式应用举例
用AOP装饰函数的技巧在实际开发中非常有用，它有助于我们编写一个松耦合和高复用的系统。

#### 数据统计上报
我们在项目开发的结尾阶段，常常被要求加上很多统计数据的代码，这可能让我们被迫改动早已封装好的函数。比如页面汇总有一个登录button，点击这个button会弹出登录浮窗，与此同时要求进行数据上报，来统计有多少用户点击了这个登录button。

```
<button tag="login" id="button">登录</button>
<script>
	var showLoginModal = function() {
		console.log("显示登录浮窗"); //模拟显示登录浮窗
		log(this.getAttribute('tag'));
	};
	var log = function(tag) {
		console.log('上报标签为：' + tag);
	};
	document.getElementById('button').onclick = showLoginModal;
</script>
```
这里的showLoginModal函数违反了单一职责原则，和开放封闭原则。我们可以用AOP修饰showLoginModal函数达到同样效果，即：

```
showLoginModal = showLoginModal.after(log);
document.getElementById('button').onclick = showLoginModal;
```
其中Function.prototype.after函数的定义和之前一样。

#### 动态改变函数的参数
项目中有一个用于发送ajax请求的函数，如下：

```
var ajax = function(type, url, param){
	console.dir(param);
	//发送ajax请求的代码略
}
ajax('get', 'http://xxx.com/userinfo', {name: 'Ava'});
```
上面的伪代码向后台发送一个请求来获取用户信息，传递的参数是{name: "Ava"}。ajax函数在项目中一致运转良好，直到有一天我们的网站收到了CSRF攻击。解决CSRF攻击最简单的办法就是在HTTP请求中带上一个Token参数。假设我们已经有了一个用于生成Token的参数：

```
var getToken = function() {
	return 'Token';
};
```
现在的任务是给每个ajax请求都加上Token参数，但不修改ajax函数。我们注意到在Function.prototype.before方法中，新增加的beforefn函数和原函数_self共用一组参数列表arguments，当我们在beforefn的函数体内改变arguments的时候，原函数_self接收的参数列表自然也会变化。所以我们可以通过Function.prototype.before装饰到ajax函数的的参数param对象中：

```
ajax = ajax.before(function(type, url, param) {
	param.Token = getToken();
});
ajax('get', 'http://xxx.com/userinfo', {name: 'Ava'});
```
从ajax函数打印的log可以看到，Token参数已经被附加到ajax请求的参数中：
`{name:"Ava", Token: "Token"}`
可以看到，用AOP的方式给ajax函数动态装饰上Token参数，保证了ajax函数是一个相对纯净的函数，提高了ajax函数的可复用性。

#### 插件化表单验证
JavaScript设计模式（一）中我们介绍过用[策略模式重构表单验证](https://chenjin3.github.io/JavaScript%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F-%E4%B8%80/#section-19)。如果我们的表单要用ajax提交，那么提交表单的函数formSubmit将承担两个职责：验证用户输入的合法性和提交ajax请求。代码如下：

```
var registerForm = document.getElementById('registerForm');
var submitBtn = document.getElementById('submitBtn');
var formSubmit = function(){
	var errorMsg = validateFunc(); //校验表单的函数
   if ( errorMsg ){
       return;
   }
   var param = {
   	username: registerForm.userName
   	password: registerForm.password
   	phoneNumber: registerForm.phoneNumber
   }
   ajax('http://xxx.com/login', param);
};
 
 submitBtn.onclick = function(
 			formSubmit();
 }
```

为了符合单一职责原则，我们要使validateFunc和formSubmit完全分离开。这里用装饰这模式重构代码如下：

```
Function.prototype.before = function( beforefn ){	var __self = this;
 	return function(){		if ( beforefn.apply( this, arguments ) ){
			// beforefn返回errorMsg的情况直接return,不再执行后面的原函数
		  	return;	}	return __self.apply( this, arguments ); 
	}}

var formSubmit = function(){
   var param = {
   	username: registerForm.userName
   	password: registerForm.password
   	phoneNumber: registerForm.phoneNumber
   }
   ajax('http://xxx.com/login', param);
};
formSubmit = formSubmit.before( validateFunc );submitBtn.onclick = function(){ 
	formSubmit();}
```
这里我们改写了Function.prototype.before函数，如果beforefn函数返回的errorMsg不为空，则直接返回，不再执行后面的原函数。这样校验输入和提交表单的代码就完全分离开了，有利于分开维护这两个函数。formSubmit=formSubmit.before( validateFunc )这句代码,如同把校验规则动态接在formSubmit函数之前,validateFunc成为一个即插即用的函数。

装饰者模式将一个对象包装起来以增加新的行为和责任；适配器模式将一个对象包装起来以改变其接口；外观模式将一群对象包装起来以简化其接口。

## 适配器模式
适配器模式主要用来解决两个已有接口之间不匹配的问题。适配器模式不需要改变已有的接口,就能够使它们协同工作。适配器是一种“亡羊补牢”的模式，没有人会在程序设计之初就使用它。也许某些现在好好工作的接口，未来某天却不在适用与新系统。那么我们可以用适配器模式把旧接口包装成一个新接口，使他继续保持生命力。

例如我们的网站先前使用了百度地图来显示一个地图，示例代码如下：

```
var baiduMap = { 
	show: function(){		console.log( '开始渲染百度地图' ); 
	}};var renderMap = function( map ){	if ( map.show instanceof Function ){		map.show(); 
	}};
renderMap( baiduMap ); //输出：开始渲染百度地图
```
由于第三方的接口不在我们自己的控制范围内，后来某一天baiduMap提供的显示方法改名叫display了。这是我们一般不去更改baiduMap这个第三方的对象，而是通过增加baiduMapAdapter来解决问题：

```
var baiduMap = {
	display: function() {
		console.log( '开始渲染百度地图' );
	}
};
var baiduAdapter = {
	show: function() {
		return baiduMap.display();
	}
}
renderMap( baiduAdapter ); //输出：开始渲染百度地图
```

适配器改变接口以符合客户的期望，而外观模式将客户从一个复杂的子系统中解耦。

## 外观模式
当需要简化并统一一个很大的接口或者一群复杂的接口时，使用外观模式。可以把外观模式看成是一组对象的适配器，其显著的特点是定义了一个新的高层接口去封装一组“子系统”。
子系统在C++或者Java中指一组类的集合，这些类相互协作可以组成系统中的一个相对独立的部分。在JavaScript中，这个子系统应该指一组函数的集合。最简单的外观模式应该类似下面的代码：

```
var A = function() {
	a1();
	a2();
};
var B = function() {
	b1();
	b2();
};
var facade = function() {
	A();
	B();
};
facade();
```

外观模式为一组子系统提供一个简单遍历的访问入口，隔离了客户与复杂子系统之间的联系，客户不用去了解子系统的细节。因此它符合最少知识原则。

## 观察者模式
观察者模式又叫发布订阅模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生变化时，所有依赖于它的对象都将得到通知。在Javascript开发中，我们一般用事件模型来代替传统的发布订阅模式。在异步编程中使用观察者模式，我们就无需过多关注对象在异步运行期间的内部状态，只需要订阅感兴趣的事件。这使得一个对象不用再显示的调用另一个对象的某个接口，发布订阅模式让两个对象松耦合的联系在一起。

#### DOM事件
只要曾经在DOM节点上绑定过事件函数，那么我们就曾经使用过观察者模式，例如：

```
document.body.addEventListener('click', function() {
	alert('hello');
}, false); // false表示在冒泡阶段调用事件处理程序
document.body.click(); //模拟用户点击
```
这里订阅document.body的click事件，当body节点被点击时，body节点便会向订阅者发布这个消息。

### 观察者模式的通用实现
让我们看一个现实中的例子。小明最新想买房，于是他跑到一个售楼处。却被告知新盘已经售罄，但过段时间还有尾盘推出。小明怅然离开，走之前把电话号留给了售楼处小姐。售楼MM答应他，新盘已退出就马上发信息通知小明。小李、小红、小强等刚需群众也是一样，他们的电话号码都被挤在了售楼处的花名册上。在这个例子中，小明、小红等购买者都是订阅者，他们订阅了房子开售的消息，售楼处作为发布者，会在合适的时候遍历花名册上的电话号码，依次给购房者发布消息。

首先，让我们来把发布订阅的功能抽象出来，实现event对象：

```
var event = {
   clientList: {}, //缓存列表，存放订阅者的回调函数 {key1: [fn1,fn2,...], ...}
   listen: function( key, fn ){ //监听事件  key:事件名，fn:订阅者的回调函数
       if ( !this.clientList[ key ] ){
           this.clientList[ key ] = [];
       }
       this.clientList[ key ].push( fn ); // 订阅的消息添加进缓存列表
   },
   trigger: function(){ //触发事件
       var key = Array.prototype.shift.call( arguments ), //取出事件类型
           fns = this.clientList[ key ]; //注册到特定事件上的回调函数集合
       if ( !fns || fns.length === 0 ){ // 如果没有绑定对应的事件
           return false;
       }
       for( var i = 0, fn; fn = fns[ i++ ]; ){//执行注册到特定事件的所有回调函数
           fn.apply( this, arguments ); // 推模型： arguments 是trigger 时带上的参数
       }
   },
   remove : function( key, fn ){//取消订阅的事件
       var fns = this.clientList[ key ];
       if ( !fns ){ // 如果key 对应的消息没有被人订阅，则直接返回
           return false;
       }
       if ( !fn ){ // 如果没有传入具体的回调函数，表示需要取消key 对应消息的所有订阅
           fns && ( fns.length = 0 );
       }else{
           for ( var l = fns.length - 1; l >=0; l-- ){ // 反向遍历订阅的回调函数列表
               var _fn = fns[ l ];
               if ( _fn === fn ){
                   fns.splice( l, 1 ); // 删除订阅者的回调函数
               }
           }
       }
   }
};
```

然后在定义一个installEvent函数，这个函数可以给对象动态的安装发布订阅功能:

```
var installEvent = function( obj ){
   for ( var fn in event ){
       obj[ fn ] = event[ fn ];
   }
};
```
最后来测试一下，我们给售楼处对象salesOffices动态的增加发布订阅功能：

```
var salesOffices = {};
installEvent( salesOffices );
salesOffices.listen( 'squareMeter88', function( price ){ // 小明订阅消息
   console.log( 'to 小明： 价格= ' + price );
});
salesOffices.listen( 'squareMeter88', function( price ){ // 小李订阅消息
   console.log( 'to 小李： 价格= ' + price );
});
salesOffices.listen( 'squareMeter100', function( price ){ // 小红订阅消息
   console.log( 'to 小红：价格= ' + price );
});
salesOffices.listen( 'squareMeter88', fn1 = function( price ){ //小强订阅的消息
   console.log( 'to 小强: 价格= ' + price );
});

salesOffices.remove('squareMeter88', fn1); //取消小强的订阅
salesOffices.trigger( 'squareMeter88', 2000000 ); //小明，小李将收到消息
salesOffices.trigger( 'squareMeter100', 3000000 );//小红将收到消息
```
观察者模式在实际开发中非常有用。既可以用在异步编程中，也可以帮助我们完成更松耦合的代码编写。从架构上来看，无论是MVC还是MVVM，都少不了观察者模式的参与，可以说事件驱动模型是Javascript语言的核心功能。
但观察者模式的大量使用也会带来一些问题，一是订阅者的创建（事件监听函数）本身要消耗一定的事件和内存。二是观察者模式弱化了对象间的联系，对象和对象之间的必要联系呗深埋在背后，可能导致程序难以跟踪维护和理解。

## 中介者模式

## 模板方法模式

## 组合模式

## 状态模式

## 享元模式

