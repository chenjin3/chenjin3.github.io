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
* [装饰者模式](#section-10)
* [适配器模式](#section-15)
* [外观模式](#section-16)

#### 一对多关系

* [观察者模式](#section-17)
* [中介者模式](#section-19)

#### 其他

* [模板方法模式](#section-21)
* [组合模式](#section-25)
* [状态模式](#section-27)
* [享元模式](#section-28)

## 单例模式
单例模式和原型模式、工厂模式一样，也是用于对对象的创建过程进行了抽象，将软件模块中对象的创建和对象的使用分离，使整个系统的设计更加符合单一职责原则。
单例模式确保在系统中一个构造器仅有一个实例，并提供全局访问。它可以在合适的时候创建唯一的一个对象。

例如我们要开发系统的登录功能。当用户单击登录按钮时，需要显示一个登录浮窗。
一种方案是在页面加载完成时就创建好这个登录浮窗，但处于隐藏状态，当用户点击登录按钮时它才显示。全局变量不是单利模式，但在JavaScript中，我们经常把带命名空间的全局变量当单例来使用，使用带命名空间的全局变量实现上述功能的代码如下：

```
//带命名空间的全局变量模拟单例
var myApp = {     loginLayer:  function(){         var div = document.createElement('div');         div.innerHTML = '我是登录浮窗';         div.style.display = 'none';         document.body.appendChild(div);         return div;     }() }; var loginLayer1 =  myApp.loginLayer; var loginLayer2 =  myApp.loginLayer; console.log(loginLayer1 == loginLayer2); //true document.getElementById( 'loginBtn' ).onclick = function() {     myApp.loginLayer.style.display = 'block'; }

```
虽然这种全局变量也可以提供唯一的对象供全局访问，但这个对象会在页面一加载好的时候就创建，而不是在需要的时候才创建对象实例。有可能用户只是到该网站浏览一些公开的信息，并不想登录。这种一开始就创建登录浮窗的方式可能白白浪费了一些DOM节点。
这时候就需要单例模式的惰性加载能力，我们可以使用惰性单例在用户点击登录按钮的时候才开始创建该浮窗，代码所示：

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
可以想象一下，如果用户快速点击很多复选框，前端会依次发送一系列http请求给服务器，如此频繁的网络请求将会带来相当大的开销。解决方案是我们可以通过一个代理函数来收集一段时间之内的请求，最后依次性发送给服务器。代码实现如下：

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
再比如你经常被手机app的推送消息所打扰，这时你需要一个勿扰模式的代理服务让某个时间段内所有消息通知都不会显示。这个保护代理的代码看起来可能是像这样的。

```
var Inbox = function() {
	//creation
}
Inbox.prototype = {
	showMessage: function(...){
		//show a message to you from inbox using the given parameters
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
在客户端的JavaScript中，我们很少访问服务器端的JavaScript对象上的方法。前端程序作为后端服务的代理，远程代理常常体现为前端JavaScript函数封装了后端Web Service的API，通过ajax等方式进行网络请求，实现对远程数据模型的代理访问。当然随着Node.js的流行，访问远程的JavaScript对象的方法也变得可能。实现可以参考异步RPC类库[DNode](https://github.com/substack/dnode)的应用示例和实现。

面向对象设计鼓励将行为分布到细粒度的对象中，将对象的访问控制的职责划分出来，放到代理对象中，符合单一职责原则，有助于实现低耦合易维护的系统。如果以后不需要访问控制了，可以直接使用本体对象，而不必修改本体对象，因此采用代理模式的设计也符合开放封闭原则。我们注意到代理对象和本体对象的接口通常是一致的，以至于用户可能并不清楚他使用的是本体对象还是代理对象。代理模式常用于控制访问开销大的资源，缓存运算结果，保护对象在某些情况下不会被非法访问，或者减少计算或网络延迟。

代理对象通常包装了本体对象，控制对象的访问。而装饰者模式为对象增加新的行为。

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
上面的伪代码向后台发送一个请求来获取用户信息，传递的参数是{name: "Ava"}。ajax函数在项目中一致运转良好，直到有一天我们的网站收到了CSRF攻击。
解决CSRF攻击最简单的办法就是在HTTP请求中带上一个Token参数。假设我们已经有了一个用于生成Token的函数：

```
var getToken = function() {
	return 'Token';
};
```
现在的任务是给每个ajax请求都加上Token参数，但不修改ajax函数。
我们注意到在Function.prototype.before方法中，新增加的beforefn函数和原函数_self共用一组参数列表arguments，
当我们在beforefn的函数体内改变arguments的时候，原函数_self接收的参数列表自然也会变化。所以我们可以通过Function.prototype.before装饰到ajax函数的的参数param对象中：

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
			return;// beforefn返回errorMsg的情况直接return,不再执行后面的原函数
	}	return __self.apply( this, arguments );
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
renderMap( baiduAdapter );
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

外观模式为一组子系统提供一个简单的访问入口，隔离了客户与复杂子系统之间的联系，客户不用去了解子系统的细节。因此它符合最少知识原则。

装饰者模式将一个对象包装起来以增加新的行为和责任；适配器模式将一个对象包装起来以改变其接口；外观模式将一群对象包装起来以简化其接口。

## 观察者模式
观察者模式又叫发布订阅模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生变化时，所有依赖于它的对象都将得到通知。在Javascript开发中，我们一般用事件模型来代替传统的发布订阅模式。在异步编程中使用观察者模式，我们就无需过多关注对象在异步运行期间的内部状态，只需要订阅感兴趣的事件。这使得一个对象不用再显式的调用另一个对象的某个接口，发布订阅模式让两个对象松耦合的联系在一起。

### DOM事件
只要曾经在DOM节点上绑定过事件函数，那么我们就曾经使用过观察者模式，例如：

```
document.body.addEventListener('click', function() {
	alert('hello');
}, false); // false表示在冒泡阶段调用事件处理程序
document.body.click(); //模拟用户点击
```
这里订阅document.body的click事件，当body节点被点击时，body节点便会向订阅者发布这个消息。

### 观察者模式的通用实现
让我们看一个现实中的例子。小明最近想买房，于是他跑到一个售楼处。却被告知新盘已经售罄，但过段时间还有尾盘推出。小明怅然离开，走之前把电话号留给了售楼处小姐。售楼MM答应他，新盘已退出就马上发信息通知小明。小李、小红、小强等刚需群众也是一样，他们的电话号码都被挤在了售楼处的花名册上。在这个例子中，小明、小红等购买者都是订阅者，他们订阅了房子开售的消息，售楼处作为发布者，会在合适的时候遍历花名册上的电话号码，依次给购房者发布消息。

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
但观察者模式的大量使用也会带来一些问题，一是订阅者的创建（事件监听函数）本身要消耗一定的事件和内存。二是观察者模式弱化了对象间的联系，对象和对象之间的必要联系被深埋在背后，可能导致程序难以跟踪维护和理解。

利用观察者模式还可以实现中介者模式，即将中介者实现为订阅者，其他对象作为发布者。在观察者模式中一般发布者和订阅者是一对多的关系，在中介者模式中，中介者和其他对象主体也是一对多的关系。

## 中介者模式
面向对象的应用程序由很多对象组成，所有对象按照某种关系来通信。当对象越来越多，他们之间的关系也越来越复杂，难免形成网状的交叉引用。当我们改变或删除其中一个对象的时候，很可能需要通知所有引用到它的对象。面向对象设计鼓励将行为分布到各个对象中，把对象划分成更小的粒度，有助于提高对象的可复用性。但由于这些细粒度对象之间的联系激增，又有可能会反过来降低系统的可维护性。

中介者模式的作用就是解除对象与对象之间的紧耦合关系。增加一个中介者对象后，所有的相关对象都通过中介者对象来通信。当一个对象发生改变时，只需要通知中介者对象即可。中介者模式使系统中各对象之间耦合降低，使得网状的多对多关系变成了相对简单的一对多关系。

### 应用举例：购买商品
![购买商品示例](/images/designPattern/mediator-demo.png)

假设我们在编写一个手机购买的页面，在购买流程中，可以选择颜色、内存，输入购买数量，同时页面中有三个展示区域，分别向用户展示刚刚选好的颜色、内存和数量。还有一个按钮动态显示下一步的操作，我们需要检查符合条件的手机对应的库存，如果库存少于这次的购买数量，按钮将被禁用并显示库存不足，反之按钮可以点击并显示放入购物车。DOM结构如下：

```
选择颜色：<select id="colorSelect">
		<option value="">请选择</option>
		<option value="red">红色</option>
		<option value="blue">蓝色</option>
	</select>
选择内存：<select id="memorySelect">
		<option value="">请选择</option>
		<option value="32G">32G</option>
		<option value="16G">16G</option>
	</select>
输入购买量：<input type="text" id="numberInput"/><br/><br/>
您选择了颜色：<div id="colorInfo"></div><br/>
您选择的内存 : <div id="memoryInfo"></div><br/>
您输入了数量: <div id="numberInfo"></div><br/>
<button id="nextBtn" disabled="true">请选择手机颜色和购买数量</button>
```
这个需求比较容易实现，假设我们已经从后台获取了所有类型手机的库存量，代码如下：

```
var colorSelect = document.getElementById( 'colorSelect'),
memorySelect = document.getElementById( 'memorySelect'),
numberInput = document.getElementById( 'numberInput'),
colorInfo = document.getElementById( 'colorInfo'),
numberInfo = document.getElementById( 'numberInfo'),
memoryInfo = document.getElementById( 'memoryInfo'),
nextBtn = document.getElementById( 'nextBtn');
var goods = { //手机库存
    "red|32G": 3,
    "blue|32G": 1,
    "blue|16G": 6
};
colorSelect.onchange = function() {
    var color = colorSelect.value, //颜色
     memory = memorySelect.value, //内存
     number = Number(numberInput.value),//数量
     stock = goods[ color + '|' + memory ];//库存
    colorInfo.innerHTML = color;//更新颜色展示
    memoryInfo.innerHTML = memory;//更新内存展示
    numberInfo.innerHTML = number;//更新购买数量展示
    //更新下一步按钮
   if(validate(color, memory, number, stock)) {
       nextBtn.disabled = false;
       nextBtn.innerHTML = '放入购物车';
   }
};
memorySelect.onchange = function() {
  var color = colorSelect.value,
      memory = memorySelect.value,
      number = Number(numberInput.value),
      stock = goods[color + '|' + memory];
  colorInfo.innerHTML = color;
  memoryInfo.innerHTML = memory;
  numberInfo.innerHTML = number;
  if(validate(color, memory, number, stock)) {
      nextBtn.disabled = false;
      nextBtn.innerHTML = '放入购物车';
  }
};
numberInput.oninput = function(){
    var color = colorSelect.value,
      memory = memorySelect.value,
      number = Number(this.value),
      stock = goods[color + '|' + memory];
    colorInfo.innerHTML = color;
    memoryInfo.innerHTML = memory;
    numberInfo.innerHTML = number;
    if(validate(color, memory, number, stock)) {
        nextBtn.disabled = false;
        nextBtn.innerHTML = '放入购物车';
    }
};
/**
 * @param color
 * @param number
 * @param stock
 * @returns {boolean}
 */
function validate(color, memory, number, stock) {
    if ( !color ){
        nextBtn.disabled = true;
        nextBtn.innerHTML = '请选择手机颜色';
        return false;
    }
    if ( !memory ){
        nextBtn.disabled = true; nextBtn.innerHTML = '请选择内存大小';
        return false;
    }
    if (!Number.isInteger(number) || number <= 0) {
        nextBtn.disabled = true;
        nextBtn.innerHTML = '请选择正确的购买数量';
        return false;
    }
    if ( number > stock ){
        nextBtn.disabled = true;
        nextBtn.innerHTML = '库存不足';
        return  false;
    }
    return true;
}
```
虽然目前完成了代码编写，但代码的耦合性很强，在每个监听函数中需要更新其他四个节点对象（颜色显示，内存显示，数量显示和下一步按钮）的状态，节点对象都是耦合在一起的，改变或者增加任何一个节点对象，所要修改的代码很多。而且每个输入节点的状态变化监听函数中的代码完全是重复的。

下面我们引入中介者对象来重构这段代码。

```
var goods = {
   "red|32G": 3,
   "red|16G": 0,
   "blue|32G": 1,
   "blue|16G": 6
};
var colorSelect = document.getElementById( 'colorSelect' ),
   memorySelect = document.getElementById( 'memorySelect' ),
   numberInput = document.getElementById( 'numberInput' ),
   colorInfo = document.getElementById( 'colorInfo' ),
   memoryInfo = document.getElementById( 'memoryInfo' ),
   numberInfo = document.getElementById( 'numberInfo' ),
   nextBtn = document.getElementById( 'nextBtn' );
 colorSelect.onchange = function(){
    mediator.changed( this );
 };
 memorySelect.onchange = function(){
    mediator.changed( this );
 };
 numberInput.oninput = function(){
    mediator.changed( this );
 };

var mediator = (function () {
   return {
       changed: function (obj) {
           var color = colorSelect.value,
                   memory = memorySelect.value,
                   number = Number(numberInput.value),
                   stock = goods[ color + '|' + memory ];
           if ( obj === colorSelect ){
               colorInfo.innerHTML = color;
           }else if ( obj === memorySelect ){
               memoryInfo.innerHTML = memory;
           }else if ( obj === numberInput ){
               numberInfo.innerHTML = number;
           }
           if ( !color ){
               nextBtn.disabled = true;
               nextBtn.innerHTML = '请选择手机颜色';
               return ;
           }
           if ( !memory ){
               nextBtn.disabled = true; nextBtn.innerHTML = '请选择内存大小';
               return ;
           }
           if (!Number.isInteger(number) || number <= 0) {
               nextBtn.disabled = true;
               nextBtn.innerHTML = '请选择正确的购买数量';
               return ;
           }
           if ( number > stock ){
               nextBtn.disabled = true;
               nextBtn.innerHTML = '库存不足';
               return;
           }
           nextBtn.disabled = false;
           nextBtn.innerHTML = '放入购物车';
       }
   }
})();
```
重构之后，所有的节点对象只和中介者通信。当下拉选择框colorSelect、memorySelect和文本输入框numberInput的发生了事件行为时，他们仅仅通知中介者他们改变了，同时把自身当做参数传入中介者，以便中介者辨别是谁发生了变化。剩下的所有事情都交给中介者对象来完成，这样一来，无论是修改还是新增节点，都只需要改动中介者对象里的代码。

如果对象间的耦合性太高，一个对象发生改变后，难免会影响到其他的对象。中介者模式是迎合最少知识原则的一种实现。引入中介者模式后，对象之间几乎不知道彼此的存在，他们只能通过中介者对象来互相影响对方。中介者模式使各个对象之间得以解耦，以中介者和对象之间的一对多关系取代了对象之前的网状多对多关系。各个对象只需关注自身功能的实现，对象间的交互关系交给了中介者对象来实现和维护。

另一方面，引入中介者之后，对象之间交互的复杂性，转移成了中介者对象的复杂性，使得中介者对象经常是一个难以维护的巨大的对象。所以我们也需要权衡中介者负责实现哪些对象间的联系。
一般来说，如果对象间的复杂耦合确实导致调用和维护出现了困难，而且这些耦合随着项目的变化呈指数增长，那我们就可以考虑用中介者模式来重构代码。

## 模板方法模式
模板方法模式是一种基于继承的设计模式，常被架构师用于搭建算法的框架。模板方法模式由两部分组成，一部分是抽象父类，第二部分是具体的实现子类。通常在抽象父类中
封装了子类的算法框架，也就是封装子类中方法的执行顺序。子类通过继承这些这个抽象类，就**继承了整个算法结构**，然后可以选择在子类中重写父类的方法实现对象的多态性。
如果相同的行为在各个对象中重复出现，我们可以将相同的行为放到父类中。在模板方法模式中，子类实现中的相同部分（算法框架和公共方法）被上移到父类中，而将不同的部分留待子类来实现。

### 泡咖啡与沏茶的例子
咖啡与茶是模板方法模式的一个经典例子。泡咖啡和沏茶的步骤如下：

泡咖啡 | 泡茶
------- | -------
把水煮沸 |把水煮沸
用沸水冲泡咖啡 |用沸水浸泡茶
把咖啡倒进杯子 |把茶水倒进杯子
加糖和牛奶 |加柠檬

经过抽象，不管是泡咖啡还是泡茶，都能归纳为下面四步：
(1)把水煮沸
(2)用沸水冲泡饮料
(3)把饮料倒进杯子
(4)加饮料

现在我们创建一个抽象的父类表示泡一杯饮料的整个过程，不论是Coffee，还是Tea，都被我们用Beverage来表示，代码如下：

```
var Beverage = function(){};
Beverage.prototype.boilWater = function(){
   console.log( '把水煮沸' );
};
Beverage.prototype.brew = function(){//用沸水冲泡饮料的抽象方法
   throw new Error( '子类必须重写brew 方法' );
};
Beverage.prototype.pourInCup = function(){//把饮料倒进杯子
   throw new Error( '子类必须重写pourInCup 方法' );
};
Beverage.prototype.addCondiments = function(){//加调料
   throw new Error( '子类必须重写addCondiments 方法' );
};
Beverage.prototype.customerWantsCondiments = function(){//钩子方法，让某子类不受算法框架的约束
   return true; // 默认需要调料
};
Beverage.prototype.init = function(){//模板方法
   this.boilWater();
   this.brew();
   this.pourInCup();
   if ( this.customerWantsCondiments() ){ // 如果挂钩返回true，则需要调料
       this.addCondiments();
   }
};
```
我们说Beverage类是一个抽象类，因为其中的brew、pourInCup和addCondiments方法，都被声明为抽象方法（抛出异常）。当子类继承这个抽象类时，必须重写这些抽象方法。而boilWater方法在每个子类中都是一样的，所以作为具体方法放到了父类中以便复用。这里我们还引入了customerWantsCondiments钩子方法，根据该方法的返回值，可以让子类决定冲泡饮料最后一步（加调料）是否需要。

接下来我们创建具体的咖啡(或茶）子类，并让它继承Beverage类。

```
var Coffee = function(){};
Coffee.prototype = new Beverage(); //原型继承

Coffee.prototype.brew = function(){
   console.log( '用沸水冲泡咖啡' );
};
CoffeeWithHook.prototype.pourInCup = function(){
   console.log( '把咖啡倒进杯子' );
};
Coffee.prototype.addCondiments = function(){
   console.log( '加糖和牛奶' );
};
Coffee.prototype.customerWantsCondiments = function(){
   return window.confirm( '请问需要调料吗？' );
};
var coffee = new Coffee();
coffee.init();
```
当调用coffee对象的init方法时，由于coffee对象和Coffee构造器的原型上都没有init方法，所以请求会顺着原型链被委托给Coffee的父类Beverage原型上的init方法。而Beverage.prototype.init 方法中已经规定好了泡饮料的顺序，所以我们能成功的泡出一杯咖啡。
Beverage.prototype.init 即被称为模板方法，该方法中封装了子类的算法框架，它作为一个算法的模板，指导子类以何种顺序去执行哪些方法，算法内的每一个步骤都清楚的展现在我们眼前。

### 模板方法模式的使用场景
模板方法模式常被架构师用于搭建项目的框架，架构师订好了框架的骨架，程序员继承框架的结构之后，负责具体的业务实现。比如我们在构建一系列的UI组件，这些组件的构建过程一般如下所示：

1. 初始化一个div容器
2. 通过ajax请求拉取相应数据
3. 把数据渲染到div容器里面，完成组件的构造
4. 通知用户组件渲染完毕

我们看到，任何组件的构建都遵循上面的4步，其中第（1）步和第（4）步对于不同组件都是相同的。第（2）步不同的地方只是请求ajax的远程地址，第（3）步不同的地方是渲染数据的方式。于是我们可以把这4个步骤都抽象到父类的模板方法里面，父类中还可以提供第（1）步和第（4）步的具体实现。当子类集成这个父类之后，会重写模板方法里面的第（2）步和第（3）步。

### 小结
模板方法模式是基于继承的一种设计模式，父类封装了子类的算法框架或方法的执行顺序，子类继承父类之后，就放弃了对自己的控制权,而是改为父类通知子类哪些方法应该在什么时候调用。这种由高层组件调用底层组件的技巧，符合“好莱坞原则”。模板方法模式在父类中封装了不变的算法框架和公共方法，在子类中重写父类方法实现不同的具体方法。通过增加新的子类，便能给系统增加新的功能，并不需要改动抽象父类及其他子类，这也符合了开放封闭原则。

## 组合模式
组合模式将对象组合成树形结构，以表示“部分-整体”的层次结构。组合模式还可以通过对象的多态性，使得用户对单个对象和组合对象的使用具有一致性。

在命令模式中我们介绍过[宏命令](https://chenjin3.github.io/JavaScript%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F-%E4%B8%80/#section-17)的结构和作用，宏命令对象包括一组具体的子命令，不管是宏命令对象，还是子命令组成了一个树形结构。其中宏命令就是组合对象，而子命令是叶对象。在宏命令的execute方法里，并不执行真正的操作，而是遍历它所包含的叶对象，把真正的execute请求委托给这些叶对象。

组合模式最大的优点在于可以一致地对待组合对象和基本对象。宏命令和基本命令的透明性使得发起请求的客户不用顾忌树中组合对象和叶对象的区别。但
组合对象可以拥有子节点，叶对象下面就没有子节点。因而用户可能产生一些误操作，比如试图向叶对象中添加子节点。为了避免这种情况，通常我们给叶对象也增加add方法，并在调用这个方法时抛出一个异常来及时提醒客户。下面我们来看一个组合模式的应用例子。

### 应用实例：扫描文件夹
文件夹和文件的关系，非常适合用组合模式来描述。文件夹里既可以包含文件，又可以包含其他文件夹。在添加一批文件的操作过程中，客户不用分辨它们到底是文件还是文件夹。运用组合模式之后，扫描整个文件夹的操作也变得轻而易举，我们只需要操作树最顶端的组合对象。

```
//文件扫描与删除
var Folder = function( name ){
        this.name = name;
        this.parent = null; //增加this.parent 属性
        this.files = [];
};
Folder.prototype.add = function( file ){
        file.parent = this; //设置父对象
        this.files.push( file );
};
Folder.prototype.scan = function(){
      console.log( '开始扫描文件夹: ' + this.name );
      for ( var i = 0, file, files = this.files; file = files[ i++ ]; ){
        file.scan();
      }
};
Folder.prototype.remove = function(){
    if ( !this.parent ){ //根节点或者树外的游离节点
      return;
      }
    for ( var files = this.parent.files, l = files.length - 1; l >=0; l-- ){
      var file = files[ l ];
      if ( file === this ){
        files.splice( l, 1 );
      }
    }
};
var File = function( name ){
        this.name = name;
        this.parent = null;
        };
File.prototype.add = function() {  //为和组合对象接口保持一致
        throw new Error( '不能添加在文件下面' );
        };
File.prototype.scan = function(){
        console.log( '开始扫描文件: ' + this.name );
        };
File.prototype.remove = function(){
    if ( !this.parent ){ //根节点或者树外的游离节点
        return;
    }
    for ( var files = this.parent.files, l = files.length - 1; l >=0; l-- ){
          var file = files[ l ];
          if ( file === this ){
          files.splice( l, 1 );
      }
    }
};
var folder = new Folder( '学习资料' );
var folder1 = new Folder( '设计模式' );
var file1 = new Folder ( '深入浅出Node.js' );
folder.add( file1 );
folder1.add( new File( '设计模式：可复用面向对象软件的基础' ) );
folder1.add( new File('Head First 设计模式'))
folder.add( folder1 );
folder.scan();//扫描文件夹
```

组合模式可以让我们使用树形方式创建对象的结构。我们可以把相同的操作应用在组合对象和单个对象上。然而，系统中的每个对象看起来都和其他对象差不多。他们的区别只有在运行时才会显现出来，有些时候这会使代码难以理解。

## 状态模式
状态模式是状态机的实现之一，它允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。状态模式的关键是把事物的每种状态都封装成单独的类，跟此种状态有关的行为都被封装在这个类的内部。当事物的状态机变迁时，只需要在上下文（Context对象）中，把这个请求委托给当前的状态对象，该状态对象会负责执行它自身的行为。而在JavaScript这种“无类”的语言中，状态对象不必从类中创建出来，也不需要事先让Context对象持有所有状态对象。只需要用Function.prototype.call 等方法直接把请求委托给状态机对象来执行。

下面给出一个状态模式实现的可隐藏的侧边栏菜单组件的例子。管理控制台一般都有一个居左的侧边栏菜单，为了让主要区域能全屏显示，侧边栏菜单有一个隐藏显示按钮。当菜单显示的时候，按下按钮，菜单会切换到隐藏状态；再按一次按钮，菜单又切换到显示状态。同一个按钮，在不同的状态下，表现出来的行为是不一样的。代码如下：

```
<div id="left-menu">我是侧边栏菜单</div>
<script>
var Menu = function() {  //Contxet对象
  this.currState = FSM.show;
  this.button = null;
}
Menu.prototype.init = function() {
    this.$DOM = document.getElementById('left-menu');
    var button = document.createElement('button');
    self = this;
    button.innerHTML = "单击隐藏菜单";
    this.button = document.body.appendChild(button);
    this.button.onclick = function() {
      //把请求委托给FSM状态机对象,并将上下文对象传入
      self.currState.buttonWasPressed.call(self);
    };
};
var FSM = { //Finite State Machine
  show: {
    buttonWasPressed: function() {
        console.log('隐藏侧边栏菜单');
        this.$DOM.style.display = 'none';
        this.button.innerHTML = "单击显示菜单";//this是上下文对象Menu
        this.currState = FSM.hide;
    }
  },
  hide: {
      buttonWasPressed:function() {
          console.log('显示侧边栏菜单');
          this.$DOM.style.display = 'block';
          this.button.innerHTML = "单击隐藏菜单";
          this.currState = FSM.show;
      }
    }
};
var menu = new Menu();
menu.init();
</script>
```

状态模式定义了状态与行为之间的关系，并将它们封装在一个类/函数里。通过增加新的状态类/状态函数，很容易增加新的状态和转换。也避免了Context对象的无限膨胀，状态切换的逻辑被分布在状态类/函数中，也就避免了Context对象中过多的条件分支。而且用对象代替字符串来记录当前的状态，也使得状态的切换一目了然。

在实际的开发中，很多场景都可以用状态机来模拟。比如一次ajax请求有请求未初始化、服务器连接已建立、请求以接收、请求处理中、请求已完成5个状态。一个格斗游戏任务有攻击、防御、跳跃、跌倒等状态。React框架将UI组件抽象成为一个状态机，组件根据状态的变化自动渲染DOM。

## 享元模式
享元（flyweight）模式是一种用于性能优化的模式，它在不同场景中共享轻量级的对象，以减少系统中对象的数量，其核心是运用共享技术解决大量类似对象带来的内存占用过高的问题。

享元模式将对象的属性划分为内部状态与外部状态。内部状态存储于对象内部，独立于具体的场景，通常不会改变；而外部状态取决于具体的场景，根据场景的变化，外部状态不能被共享。我们可以把所有内部状态相同的对象都指定为同一个共享对象，以减少系统中的对象。而外部状态可以从对象身上剥离出来，并存储在外部。
剥离了外部状态的对象成为共享对象，外部状态在必要时被传入共享对象来组装成一个完整的对象。虽然组装外部状态成为一个完整的对象的过程需要花费一定的时间，但却可以大大减少系统中对象的数量。因此，享元模式是一种用时间换空间的优化模式。

让我们来看一个例子。一个内衣淘宝店有50种男士内衣，50种女士内衣。为了推销产品，需要一些模特来穿上这些内衣拍广告照片。第一种方式是招聘50个男模特和50个女模特，让他们每人分别穿上一件内衣拍照。这种不使用享元模式的方案代码如下：

```
var Model = function( sex, underwear){
    this.sex = sex;
    this.underwear= underwear;
};
Model.prototype.takePhoto = function(){
    console.log( 'sex= ' + this.sex + ' underwear=' + this.underwear);
};
for ( var i = 1; i <= 50; i++ ){
    var maleModel = new Model( 'male', 'underwear' + i );
    maleModel.takePhoto();
};
for ( var j = 1; j <= 50; j++ ){
    var femaleModel= new Model( 'female', 'underwear' + j );
    femaleModel.takePhoto();
};
```
要得到一张照片，每次都需要传入sex和underwear参数。现在一共50种男内衣和50种女内衣，所以一共会产生100个对象。为了优化性能，我们需要减少对象的创建。第二种方案是找一个男模特和一个女模特，分别穿上50种不同的内衣拍照。也就是将underwear参数从构造函数中移除，构造函数只接收sex参数，优化代码如下：

```
var Model = function( sex ){
    this.sex = sex;
};
Model.prototype.takePhoto = function(){
    console.log( 'sex= ' + this.sex + ' underwear=' + this.underwear);
};
var maleModel = new Model( 'male' ),
    femaleModel = new Model( 'female' );

for ( var i = 1; i <= 50; i++ ){
    maleModel.underwear = 'underwear' + i;
    maleModel.takePhoto();
};
for ( var j = 1; j <= 50; j++ ){
    femaleModel.underwear = 'underwear' + j;
    femaleModel.takePhoto();
};
```
优化之后，只需要两个对象便完成了同样的功能。这个例子初步展示了享元模式的力量，但还有两个问题：
1. 在上例中我们通过构造函数显式new出男女两个model对象。但在某些场景下可能并不是在一开始就需要实例化所有共享对象。
2. 给model对象手动设置了underwear外部状态。当外部状态较多时，这不是一个好的方式。

我们可以通过一个对象工厂来解决第一个问题，只有当共享对象被真正需要时，它才从工厂中被创建出来。对于第二个问题，可以用一个管理器来记录的外部状态，使这些外部状态通过某个钩子和共享对象联系起来。

### 应用实例： 多文件上传
![多文件上传Demo](/images/designPattern/flyweight.png)

为了支持同时上传多个文件，如果每个文件都对应一个JavaScript上传对象的创建，程序中会同时new出成百上千个upload对象，造成内存的而浪费。这里我们可以使用享元模式将同一种上传方式的文件上传任务交给一个共享对象即可。为了简化示例程序，这里只保留upload对象的删除文件功能(Upload.prototyp.delFile)。由于我们只用一种上传方式上传文件，这里的upload对象没有内部状态，待上传文件的实际大小，文件列表项的DOM节点等属性均可以作为外部状态。简化的Upload构造器代码如下：

```
var Upload = function() {};
Upload.prototype.delFile = function(id) {
  //把当前id对应的对象的外部状态组装到共享对象中
  uploadManager.setExternalState(id, this);
  if( this.fileSize < 3000) {
    return this.dom.parentNode.removeChild(this.dom);
  }
  if(window.confirm('确定要删除该文件吗?' + this.fileName)) {
    return this.dom.parentNode.removeChild(this.dom);
  }
}
```
在开始删除文件之前，先读取文件的实际大小，而文件的实际大小被存储在外部管理器uploadManager中。这里通过uploadManager.setExternalState方法给共享对象设置正确的fileSize。

我们使用一个单例工厂来创建共享对象：

```
var UploadFactory = (function(){
    var uplodObj;
    return {
      create: function() {
        if(uploadObj) {
          return uploadObj;
        }
        return uploadObj = new Upload();
      }
    }
  })();
```
然后通过外部管理器封装外部状态，它负责向UploadFactory提交创建对象的请求，并用一个uploadDatabase对象保存upload对象的外部状态，以便在程序运行过程中给upload共享对象设置外部状态，代码如下：

```
var uploadManager = (function(){
    var uploadDatabase = {};   //upload对象的外部状态仓库
    return {
        add: function( id, fileName, fileSize ){
            var flyWeightObj = UploadFactory.create();//提交创建对象的请求
            var dom = document.createElement( 'div' );
            dom.innerHTML =
                    '<span>文件名称:'+ fileName +', 文件大小: '+ fileSize +'</span>' +
                    '<button class="delFile">删除</button>';
            dom.querySelector( '.delFile' ).onclick = function(){
                flyWeightObj.delFile( id );
            };
            document.body.appendChild( dom );
            uploadDatabase[ id ] = { //初始化外部状态仓库
                fileName: fileName,
                fileSize: fileSize,
                dom: dom
            };
            return flyWeightObj ;
        },
        setExternalState: function( id, flyWeightObj ){ //给共享对象设置外部状态
            var uploadData = uploadDatabase[ id ];
            for ( var i in uploadData ){
                flyWeightObj[ i ] = uploadData[ i ];
            }
        }
    }
})();
```
然后是开始触发上传动作的startUpload函数。用户选择的文件列表被组合成一个数组files传递给startUpload函数，该函数会遍历files数组来创建对应的upload对象。代码如下：

```
var id = 0;
window.startUpload = function(files) {
  for ( var i = 0, file; file = files[ i++ ]; ){
      var uploadObj = uploadManager.add( ++id, file.fileName, file.fileSize );
  }
}
```
最后调用startUpload函数测试一下：

```
startUpload(  [
    { fileName: '1.txt', fileSize: 1000},
    { fileName: '2.html', fileSize: 3000},
    { fileName: '3.txt', fileSize: 5000},
    { fileName: '4.txt', fileSize: 1000},
    { fileName: '5.html', fileSize: 3000},
    { fileName: '6.txt', fileSize: 5000}
]);
```
在这个例子中，如果不使用享元模式，代码里需要为6个文件创建6个upload对象。而采用享元模式后，只需要一个共享的upload对象。如果需要上传的文件是成百上千个，就会大大提高程序的性能。

享元模式模式是优化性能的一种设计模式，这与大部分模式为了封装变化而诞生的原因不同。在一个存在大量相似对象的系统中，享元模式可以很好的解决大量对象带来的性能问题。

## 参考资料

1. 《设计模式—可复用面向对象软件的基础》，作者: [美] Erich Gamma等，机械工业出uploadManager版社
2. 《Head First 设计模式》作者: 弗里曼，中国电力出版社
3. 《JavaScript设计模式与开发实践》 作者:曾探，人民邮电出版社
4. 《JavaScript高级程序设计》作者：Nicholas C.Zakas，人民邮电出版社


