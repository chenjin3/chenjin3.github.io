---
layout: post
title: JavaScript设计模式（一）
published: true
---
本文将介绍前端开发中常见设计模式的应用场景，及Javascript实现。

## 设计模式定义与作用

设计模式源于建筑学的建筑模式语言，20世纪90年代“四人帮”(Gang of Four)在《Elements of Resusable Object-Oriented Software》一书中提出了23种设计模式。设计模式可以定义为：在面向对象软件设计过程中针对特定问题的简洁而优雅的解决方案。其主题是封装变化（把程序中不变的部分和变化的部分分离开），以提高程序的复用性和可维护性。GoF这些人将程序设计中的套路总结出来给予命名，不仅为开发人员提供了解决实际问题的高级的工具集，也使得大家可以在更高的设计层面进行交流，而不必使用继承，组合，多态这些语言实现层面的概念沟通，大大提高了开发人员及团队的沟通效率，有效减少团队成员在软件设计时的误解。

因此，深入了解设计模式，对于程序设计能力和团队合作能力的提升大有益处。比如系统中某个接口的结构已经不能符合目前的需求,但又不想去改动这个被灰尘遮住的老接口, 一个熟悉模式的开发者将很快地找到适配器模式来解决这个问题。再比如当你看到系统中存在一些大量的相似对象,这些对象给系统的内存带来了较大的负担。如果你熟悉设计模式,那么第一时间就可以想到用享元模式来优化这个系统。

## 面向对象程序设计原则

可以说每种设计模式都是为了符合某些设计原则而出现的。如果说设计模式是前人总结出的软件开发的武功套路，那么设计原则就是贯穿其中的拳法要领。为了更好的理解设计模式，我们先回顾一下面向对象程序设计的一些基本原则。

* 合成复用原则：多用组合，少用继承
* 接口隔离原则：类间的依赖关系应该建立在最小的接口上
* 开放封闭原则：对扩展开放，对修改关闭
* 里氏替换原则：派生类对象能够替换其基类对象被使用
* 依赖倒置原则：依赖抽象，不要依赖具体类
* 好莱坞原则：  高层组件调用底层组件，而不要反过来
* 单一职责原则：每个类/函数只包含一个引起变化的原因  
* 最少知识原则：为交互对象之间的松耦合设计而努力，避免调用由另一个方法返回的对象的方法

## 重构：为了更美好的未来

如果能遵循这些设计原则，写出的代码将是可复用可维护，具有良好可读性而易于测试的高质量代码。在这个看重效率、崇尚唯快不破的敏捷开发的年代，很多创业团队迫于项目周期或业务压力，选择牺牲代码质量，快速实现一个差不多的软件。这样开发出来软件不能作为产品发布而只是一个原型Demo，可以To VC，但是不能To C。因为后续代码的修改，产品的迭代升级将会困难重重，经常到后来只能推倒重建。应用合适的设计模式重构代码（或者在一开始就精心设计），初期虽然会增加一些时间和代码量，但从长远来看，是一种高回报的投入，可以大大降低软件的后续迭代和维护的成本，从整体上降低软件的研发成本，甚至决定了产品的生命周期。

## 常见设计模式概览

### Javascript原生支持的模式  

* [原型模式](#section-7)
* [工厂模式](#section-9)
* [迭代器模式](#section-13)
* [职责链模式](#section-15 "职责链模式与电商预购应用")
* [命令模式](#section-16)
* [策略模式](#section-18)

### 包装模式

* [单例模式](#user-content-单例模式)
* [代理模式](#user-content-代理模式)
* [装饰者模式](#user-content-装饰者模式)
* [适配器模式](#user-content-适配器模式)
* [外观模式](#user-content-外观模式)

### 一对多关系

* [观察者模式](#user-content-观察者模式)
* [中介者模式](#user-content-中介者模式)

### 其他模式

* [模板方法模式](#user-content-模板方法模式)
* [组合模式](#user-content-组合模式)
* [状态模式](#user-content-状态模式)
* [享元模式](#user-content-享元模式)


## 原型模式

原型模式是用于创建建对象的一种模式,如果我们想要创建一个对象, 一种方法是先指定它的类型,然后通过类来实例化这个对象。原型模式采用了另外一种方式,我们不再关心对象的类型,而是找到一个对象,然后通过克隆来创建一个一模一样的对象。

### 使用克隆创建对象的例子

假设我们在编写一个飞机大战的网页游戏。某种飞机拥有分身技能,当它使用分身技能的时候,要在页面中创建一些跟它一模一样的飞机。如果不使用原型模式,那么在创建新飞机之前,需要先保存飞机的当前血量、攻击和防御等级,随后将这些信息设置到新创建的飞机上面,这样才能得到一架一模一样的新飞机。如果使用原型模式,我们只需要调用负责克隆的方法Object.create（ECMAScript 5 提供）,就能完成同样的功能。如下所示：

	 var Plane = function() {
        this.blood = 100;
        this.attackLevel = 1;
        this.defencseLevel = 1;
    }
    var plane = new Plane();
    plane.blood = 500;

    var clonePlane = Object.create(plane);
    console.log(clonePlane);  // Object {blood: 500, attackLevel: 1, defenseLevel: 1}


### JavaScript的原型继承

Javascript中的大部分数据都是对象（除了基本类型），这些对象追根溯源都来自于一个根对象Object.prototype，都是从 Object.prototype对象克隆而来的。在Javascript中 **new** 运算符的本质就是克隆Object.prototype对象，再将对象的原型指向函数构造器的原型，并给新对象设置相应属性的过程。我们可以通过下面代码来理解 new 运算的过程。

```
	 function Person(name) {
        this.name = name;
    }
    var a = new Person("Marlon"); 
    console.log("a.name: " + a.name);
```

```
	 var objectFactory = function() {
        var obj = new Object(),  // 从Object.prototype上克隆一个空对象
            Constructor = [].shift.call(arguments);  //取得传入的构造器，此例是Person
        obj.__proto__ = Constructor.prototype;  //指向正确的原型
        var ret = Constructor.apply(obj, arguments); // 用传入的构造器给obj设置属性
        return typeof ret === 'object' ? ret : obj; //确保总是返回一个对象
    }
    var b = objectFactory(Person, 'Marlon'); //b和a是等价的,原型都是Person.prototype
    console.log("b.name: " + b.name);  
    
    console.log(Object.getPrototypeOf(b) === Person.prototype); //true

```

如上所示，对象会记住它的原型，JavaScript给对象提供了一个名为__proto__的隐藏属性（在Chrome、Firefox和Safari上可以访问到），对象的__proto__属性默认会指向它的构造器的原型对象,即{Constructor}.prototype。该属性是对象跟对象构造器的原型联系起来的纽带。如果对象无法响应某个请求，他会把这个请求委托给他的构造器的原型对象。请求顺着原型链传递下去,直到遇到一个可以处理该请求的对象为止。这就是原型继承得以实现的原因，下面这段代码将b对象的构造器B的原型指向对象a，让b对象能够借用a对象的能力。

	var A = function() {};
    A.prototype = {name:'Marlon'};
    var a = new A();
    var B = function() {};
    B.prototype = a;
    var b = new B();
    console.log(b.name); //输出：Marlon


## 工厂模式

工厂模式是用来封装创建对象逻辑的。将对象的创建和对象本身业务处理分离可以降低系统的耦合度，使得两者修改起来都相对容易。外界对于这些对象只需要知道它们共同的接口，而不清楚其具体的实现细节，使整个系统的设计更加符合单一职责原则。工厂模式有三种变种：简单工厂模式（又称为静态工厂方法模式），工厂方法模式和抽象工厂模式。

### 简单工厂模式

在简单工厂模式中，可以根据参数的不同返回不同的实例，工厂封装对象的创建，将客户程序从具体产品类中解耦。假如我们想在网页面里插入一些元素，而这些元素类型不固定，可能是图片，也有可能是链接或是文本。用工厂模式实现如下：

```
var dom = dom || {};
//子函数1：处理文本
dom.Text = function () {
    this.insert = function (where) {
        var txt = document.createTextNode(this.url);
        where.appendChild(txt);
    };
};

//子函数2：处理链接
dom.Link = function () {
    this.insert = function (where) {
        var link = document.createElement('a');
        link.href = this.url;
        link.appendChild(document.createTextNode(this.url));
        where.appendChild(link);
    };
};

//子函数3：处理图片
dom.Image = function () {
    this.insert = function (where) {
        var img = document.createElement('img');
        img.src = this.url;
        where.appendChild(img);
    };
};

// 工厂方法
dom.factory = function (type) {
    return new page.dom[type];
}

//客户端程序
var link = dom.factory('Link');
link.url = 'http://www.google.com';
link.insert(document.body);

```

当对象的创建比较复杂，或者需要依赖具体环境常见不同的对象，或者需要处理大量具有相同属性的小对象、需要缓存对象的时候适合使用简单工厂模式。而下面要介绍的工厂方法模式和抽象工厂模式都是为了迎合依赖倒置原则，解开对象类型之间的耦合关系，让对象表现出多态性而产生的。

### 工厂方法模式

工厂方法模式定义了一个创建对象的接口，但由子类决定要实例化的类是哪一个。类图如下：
![工厂方法模式类图](/images/designPattern/factoryMethod.png)

### 抽象工厂模式

抽象工厂模式提供一个创建一系列相关或相互依赖对象的接口，而无须指定它们具体的类。其中由同一个具体工厂类创建的对象属于同一个产品家族。类图如下：
![工厂方法模式类图](/images/designPattern/abstractFactory.png)

当抽象工厂模式中每一个具体工厂类只创建一个产品对象，也就是只存在一个具体产品类时，抽象工厂模式退化成工厂方法模式；当工厂方法模式中抽象工厂与具体工厂合并，提供一个统一的工厂来创建产品对象，工厂方法模式退化成简单工厂模式。

由于JavaScript是动态类型语言。没有类型，就没有类型耦合问题。所以其实JavaScript是不需要像工厂方法模式和抽象工厂模式中那样定义一个抽象工厂接口来向上转型以实现对象的多态性。Javascript中对象的多态性是天然的，没有必要刻意去把对象“延迟”到子类创建，简单工厂就可以创建不同类型的具体产品，只要向工厂对象传入不同的产品对象即可。也就是说,JavaScript实际上是不需要工厂方法模式和抽象工厂模式的。

## 迭代器模式

迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素。ECMAScript5为数组定义的forEach就是迭代器模式的原生实现，用法如下：

	[2, 5, , 9].forEach(function(element, index, array){
     	console.log('a[' + index + '] = ' + element);
    });

迭代器可以分为内部迭代器和外部迭代器。原生的forEach函数属于内部迭代器，使用起来非常方便，函数的内部已经定义好了迭代规则,外部只需要一次初始调用。但是内部迭代器无法控制迭代规则，不够灵活。这就需要外部迭代器，外部迭代器会显示的请求迭代下一个元素，可以控制迭代的过程和顺序。下面是使用外部迭代器比较两个数组是否相等的示例程序：

```
var Iterator = function(obj) {
     var current = 0;
     var next = function () {
         current += 1;
     };
     var isDone = function() {
         return current >= obj.length;
     }
     var getCurrItem = function() {
         return obj[current];
     }
     return {
         next: next,
         isDone: isDone,
         getCurrItem: getCurrItem
     }
}
var compare = function(iterator1,iterator2) {
     while( !iterator1.isDone() && !iterator2.isDone()) {
       if(iterator1.getCurrItem() !== iterator2.getCurrItem()){
             throw new Error('iterator1 !== iterator2');
       }
       iterator1.next(); //显示请求迭代下一个元素
       iterator2.next();
     }
     alert('iterator1 == iterator2');
}
var iterator1 = Iterator( [ 1, 2, 3 ] );
var iterator2 = Iterator( [ 1, 2, 3 ] );
compare( iterator1, iterator2 ); //iterator1 == iterator2
```

### 应用举例：根据浏览器环境选择不同上传文件方式

由于使用控件上传文件可以暂停和续传，所以优先使用控件上传。如果没有安装上传控件，则使用flash上传，如果也没有安装flash，则使用原生的表单上传。直接实现代码如下：

    var getUploadObj = function(){
        try{
            return new ActiveXObject( "TXFTNActiveX.FTNUpload" );//IE 上传控件
        }catch(e){
            var swf = navigator.plugins["Shockwave Flash"] || new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            if(swf) {
                var str = '<object type="application/x-shockwave-flash"></object>';
                return $(str).appendTo($('body'));  //flash上传
            }else{
                var str = '<input name="file" type="file" class="ui-file"/>'; //表单上传
                return $( str ).appendTo( $('body') );
            }
        }
    };

这段代码很直接，但并不优雅。首先这个getUploadObj函数里面充斥着try，catch和if else条件分支。如果之后还要增加其他上传方式，只能往这个函数里面增加条件分支，严重违反开放封闭原则。下面用迭代器模式重构程序，代码如下：

	var getActiveUploadObj = function(){ 
        try{
            return new ActiveXObject( "TXFTNActiveX.FTNUpload" );
        }catch(e){
            return false;
        }
    };
    var getFlashUploadObj = function(){
       //mock
        return false;
    };
    var getFormUpladObj = function(){
        var str = '<input name="file" type="file" class="ui-file"/>';
        return $( str ).appendTo( $('body') );
    };
    var iteratorUploadObj = function(){
        for ( var i = 0, fn; fn = arguments[ i++ ]; ) {
            var uploadObj = fn();
            if (uploadObj !== false) {
                return uploadObj;
            }
        }
    };
    var uploadObj = iteratorUploadObj( getActiveUploadObj, getFlashUploadObj, getFormUpladObj);
    console.log(uploadObj);

经过重构，将不同的上传方式封装到独立的函数中，方便之后扩展。每个函数都遵循一个约定：如果该函数里面的upload对象是可用的,则让函数返回该对象,反之返回false,提示迭代器往后面迭代。

## 职责链模式
职责链模式将处理请求的对象连成一条链，并沿着这条链传递请求，直到一个请求处理它为止，从而避免的发送者和接收者之间的耦合关系。

### 一个电商预购的例子
假设一个售卖手机的电商网站,经过分别交纳500元和200元定金的预订后,现在到了正式购买的阶段。公司针对支付过定金的用户有一定的优惠政策。在正式购买后, 已经支付过500元定金的用户会收到100元的商城优惠券,支付过200元的用户可以收到50元的优惠券,而之前没有支付定金的用户只能进入普通购买模式,也就是没有优惠券, 且在库存有限的情况下不一定保证能买到。下面把这个流程写成代码：
	
    var order = function( orderType, pay, stock ){
        if ( orderType === 1 ){ // 500 元定金购买模式
            if ( pay === true ){ // 已支付定金
                console.log( '500 元定金预购, 得到100 优惠券' );
            }else{ // 未支付定金，降级到普通购买模式
                if ( stock > 0 ){ // 用于普通购买的手机还有库存
                    console.log( '普通购买, 无优惠券' );

                }else{
                    console.log( '手机库存不足' );
                }
            }
        }
        else if ( orderType === 2 ){ // 200 元定金购买模式
            if ( pay === true ){
                console.log( '200 元定金预购, 得到50 优惠券' );
            }else{
                if ( stock > 0 ){
                    console.log( '普通购买, 无优惠券' );
                }else{
                    console.log( '手机库存不足' );
                }
            }
        }
        else if ( orderType === 3 ){
            if ( stock > 0 ){
                console.log( '普通购买, 无优惠券' );
            }else{
                console.log( '手机库存不足' );
            }
        }
    };
    order( 1 , true, 500); // 输出： 500 元定金预购, 得到100 优惠券

这段代码虽然可以完成任务，但这个大函数包含许多嵌套的条件分支语句，很难维护。可以把500元订单、200元订单和普通购买分成三个函数，采用职责链模式重构它，代码如下：

```
var order500 = function( orderType, pay, stock ){
if ( orderType === 1 && pay === true ){
	console.log( '500 元定金预购, 得到100 优惠券' );
}else{
	order200( orderType, pay, stock ); // 将请求传递给200 元订单
}
};
// 200 元订单
var order200 = function( orderType, pay, stock ){
if ( orderType === 2 && pay === true ){
	console.log( '200 元定金预购, 得到50 优惠券' );
}else{
	orderNormal( orderType, pay, stock ); // 将请求传递给普通订单
}
};
// 普通购买订单
var orderNormal = function( orderType, pay, stock ){
if ( stock > 0 ){
	console.log( '普通购买, 无优惠券' );
}else{
	console.log( '手机库存不足' );
}
};
// 测试结果：
order500( 1 , true, 500); // 输出：500 元定金预购, 得到100 优惠券
order500( 1, false, 500 ); // 输出：普通购买, 无优惠券
order500( 2, true, 500 ); // 输出：200 元定金预购, 得到500 优惠券
order500( 3, false, 500 ); // 输出：普通购买, 无优惠券
order500( 3, false, 0 ); // 输出：手机库存不足
```

重构后的代码让请求在三个职责链节点的处理函数中传递，直到请求任务被正确处理。比起之前的实现，代码结构清晰很多。但请求在链条传递中的顺序是写死的，传递请求的代码被耦合在了业务函数之中。如何能让链中的各个节点可以灵活拆分和重组呢？我们需要用Chain构造器把处理业务的函数包装进职责链节点。代码如下：


    var order500 = function( orderType, pay, stock ){
        if ( orderType === 1 && pay === true ){
            console.log( '500 元定金预购，得到100 优惠券' );
        }else{
            return 'nextSuccessor'; //不能处理请求，则将请求向后面传递
        }
    };
    var order200 = function( orderType, pay, stock ){
        if ( orderType === 2 && pay === true ){
            console.log( '200 元定金预购，得到50 优惠券' );
        }else{
            //return 'nextSuccessor'; //把请求往后面传递
            var self = this;
            var args = arguments;
            setTimeout(function() {  //异步职责链
                self.next.apply(self, args); //向后传递请求
            },1000);
        }
    };
    var orderNormal = function( orderType, pay, stock ){
        if ( stock > 0 ){
            console.log( '普通购买，无优惠券' );
        }else{
            console.log( '手机库存不足' );
        }
    };

    //用Chain类把普通函数包装成职责链的节点
    var Chain = function( fn ){
        this.fn = fn;
        this.successor = null;
    };
    Chain.prototype.setNextSuccessor = function( successor ){  //指定在链中的下一个节点
        return this.successor = successor;
    };
    Chain.prototype.passRequest = function(){ //传递请求给某个节点
        var ret = this.fn.apply( this, arguments );
        if ( ret === 'nextSuccessor' ){
          return this.successor && this.successor.passRequest.apply( this.successor,arguments);
        }
        return ret;
    };
    //传递请求给职责链的下一个节点，用于异步职责链
    Chain.prototype.next = function() {
      return this.successor && this.successor.passRequest.apply(this.successor, arguments);
    };

    //把三个订单函数包装成职责链的节点
    var chainOrder500 = new Chain( order500 );
    var chainOrder200 = new Chain( order200  );
    var chainOrderNormal = new Chain( orderNormal );
    chainOrder500.setNextSuccessor( chainOrder200 ); //指定节点在职责链中的顺序
    chainOrder200.setNextSuccessor( chainOrderNormal );
    chainOrder500.passRequest( 1, true, 500 ); // 把请求传递给第一个节点，输出：500 元定金预购，得到100 优惠券
    chainOrder500.passRequest( 2, true, 500 ); // 输出：200 元定金预购，得到50 优惠券
    chainOrder500.passRequest( 3, true, 500 ); // 输出：普通购买，无优惠券
    chainOrder500.passRequest( 1, false, 0 ); // 输出：手机库存不足

## 命令模式
有时候我们需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的具体操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求的发送方和请求的接收方能消除彼此之间的耦合关系。命令模式将请求包装成一个接收者和一组完成某些特定事情的指令。

这里以一个开关电视机的命令展示面向对象的命令模式的实现：

```
   var Tv = { //命令接收者
        open: function () {
            console.log('打开电视机');
        },
        close: function () {
            console.log('关闭电视机');
        }
    };
    var OpenTvCommand = function (receiver) { //命令对象
        this.receiver = receiver;  //接收者被保存为对象的属性
    };
    OpenTvCommand.prototype.execute = function () { //执行动作
        this.receiver.open(); //
    };
    OpenTvCommand.prototype.undo = function () { //撤销动作
        this.receiver.close(); //
    };
    var setCommand = function (command) { //请求发送者
        document.getElementById('execute').onclick = function(){
            command.execute(); //通过命令对象的execute()发出请求
        };
        document.getElementById('undo').onclick = function () {
            command.undo();
        }
    };
    setCommand(new OpenTvCommand(Tv)); //发送请求
```
在面向对象设计中, 请求的接收者被当成命令对象的属性保存。而在JavaScript中，命令模式一般使用闭包来实现。接收者被封闭在闭包产生的环境中,仅仅执行回调函数即可。如下所示：

```
    var Tv = {  
        open: function () {
            console.log('打开电视机');
        },
        close: function () {
            console.log('关闭电视机');
        }
    };
    var createCommand = function (receiver) { 
        var execute = function () {  
            return receiver.open(); //闭包上下文中的请求的接收者
        }
        var undo = function () {
                return receiver.close();
        }
        return {
            execute: execute,
            undo: undo
        }
    };
``` 

这里的createCommand命令将工作委托给请求接收者Tv来完成，我们将其称为傻瓜命令。而智能命令中的命令对象会自己处理请求。

### 宏命令
宏命令是一组命令的集合，通过执行宏命令，可以一次执行一批命令。下面我们来用代码来演示宏命令的执行重放和撤销。假设一个遥控器有4个按钮：批量执行，重放，撤销，全部撤销。按下批量执行按钮，会执行三个命令：关门，打开PC，登录QQ。示例代码如下：

```
	 //定义三个“智能命令”
    var closeDoorCommand = {
        execute: function(callback){
            var that = this;
            setTimeout(function(){
                console.log( '关门' );
                callback.apply(that);
            },1000);

        },
        undo: function() {
            console.log( '开门' );
        }
    };
    var openPcCommand = {
        execute: function(callback){
            console.log( '开电脑' );
            callback.apply(this);
        },
        undo: function() {
            console.log( '关电脑' );
        }
    };
    var openQQCommand = {
        execute: function(callback){
            console.log( '登录QQ' );
            //callback(context);
            callback.apply(this);
        },
        undo: function() {
            console.log( '退出QQ' );
        }
    };
```

```
	 //定义宏命令
    var MacroCommand = function(){
        return {
            commandsList: [], //命令队列
            i: 0,  //当前命令下标
            add: function( command ){
                this.commandsList.push( command );
            },
            executeAll: function(){ //同步命令队列执行
                for ( var i = 0, command; command = this.commandsList[ i++ ]; ){
                    command.execute();
                }
            },
            execute: function() { //异步命令队列执行
                var command;
                if(this.i == this.commandsList.length ) {
                    this.i = 0;
                    return;
                }
                command = this.commandsList[this.i++];
                if(command) {
                    command.execute.call(this,this.execute);
                }
            },
            undo: function () {
                this.command = this.commandsList.pop();
                if(this.command) {
                    this.command.undo();
                }
            },
            undoAll: function() {
                while(this.command = this.commandsList.pop()) {
                    this.command.undo();
                }
            }
        }
    };
    
    //将命令设置到对应按钮上（命令的发送者）
    var macroCommand = MacroCommand();
    var setCommand = function (command) {
        document.getElementById('batch').onclick = function () {
        	   //添加子命令到宏命令集合汇总
            macroCommand.add( closeDoorCommand );
            macroCommand.add( openPcCommand );
            macroCommand.add( openQQCommand );
            //command.executeAll();
            command.execute();
        }
        document.getElementById('replay').onclick = function () {
            command.execute();
        }
        document.getElementById('undoOne').onclick = function () {
            command.undo();
        }
        document.getElementById('undoAll').onclick = function () {
            command.undoAll();
        }
    }
    setCommand(macroCommand);
```

宏命令是命令模式与组合模式联用的产物。关于组合模式的知识，参见[组合模式](#user-content-组合模式)。这里我们也演示了宏命令的replay功能，命令的重放常被应用在日志系统中。在日志系统中，每个命令在执行的同时会被记录到文件中，当系统出现问题时，可以从文件中重新加载这些命令并以正确的次序执行。

没有请求接收者的智能命令，在代码结构上和策略模式相同，只是意图不同，下面让我们看一下策略模式。

## 策略模式
策略模式用于封装一系列的算法，将算法的使用与实现分离开。

在前端开发中写表单是最常见的任务之一，我们在写表单的时候需要对用户的输入进行校验。一个简单的表单验证如下图所示。
![表单验证](/images/designPattern/policy.png)
直接实现表单校验的代码如下：

```
<form action="http://xxx.com/register" id="registerForm" method="post">
    用户名：<input type="text" name="userName" />
    密码：<input type="text" name="password" />
    手机号：<input type="text" name="phoneNumber"/>
    <button id="submitBtn" type="submit">提交</button>
</form>

<script>
  var registerForm = document.getElementById( 'registerForm' );
    registerForm.onsubmit = function(){
        if ( registerForm.userName.value === '' ){
            alert ( '用户名不能为空' );
            return false;
        }
        if ( registerForm.password.value.length < 6 ){
            alert ( '密码长度不能少于6位' );
            return false;
        }
        if(!/(^1[3|5|8][0-9]{9}$)/.test( registerForm.phoneNumber.value)){
            alert ( '手机号码格式不正确' );
            return false;
        }
    }
</script>    
```
registerForm.onsubmit比较复杂，包含了很多条件语句，而且缺乏弹性，如果想增加或修改校验规则，都需要深入函数的内部实现，违反开放封闭原则。这样的校验算法复用性也比较差，其他表单也需要校验时，只能复制粘贴校验逻辑。策略模式可以解决这些问题。

### 策略模式重构表单验证
用策略模式重构表单验证的实现，首先是将算法封装为策略对象，该策略对象中包含多个策略函数。如下所示：

```
 var strategies = {
        isNonEmpty: function( value, errorMsg ){ // 不为空
            if ( value === '' ){
                return errorMsg ;
            }
        },
        minLength:function(value,length,errorMsg){//限制最小长度
            if ( value.length < length ){
                return errorMsg;
            }
        },
        isMobile: function( value, errorMsg ){ // 手机号码格式
            if ( !/(^1[3|5|8][0-9]{9}$)/.test( value ) ){
                return errorMsg;
            }
        }
    };
```
之后，我们需要实现一个上下文对象(Validator类)，它负责接收用户的请求并委托给strategy对象。用户可以通过validator对象为表单配置校验规则，并启动校验，代码如下：

```
//向Context发请求的客户端
    var registerForm = document.getElementById( 'registerForm' );
    registerForm.onsubmit = function(){
        var errorMsg = validateFunc();//如果errorMsg有确切的返回值，说明未通过校验
        if ( errorMsg ){
            alert ( errorMsg );
            return false; // 阻止表单提交
        }
    };
    var validateFunc = function(){
        var validator = new Validator(); // 创建一个validator对象
        //添加一些校验规则
        validator.add( registerForm.userName, 'isNonEmpty', '用户名不能为空' );
        validator.add(registerForm.password, 'minLength:6','密码长度不能少于6 位');
        validator.add( registerForm.phoneNumber, 'isMobile','手机号码格式不正确');
        var errorMsg = validator.start(); // 启动校验获得校验结果
        return errorMsg; // 返回校验结果
    }
```

**说明:**'minLength:6'是一个以冒号隔开的字符串。冒号前面的minLength代表    的 strategy策略函数,  后面的数字 6 表示在在校验过程中所所需的一些参数。如果这个字字符串中不包含冒号,说明校验过程中不需要额外的参数, 如'isNonEmpty'。

上下文对象Validator类的实现如下：

```
    var Validator = function(){
        this.cache = []; // 保存校验规则
    };
    Validator.prototype.add = function( dom, rule, errorMsg ){
        var ary = rule.split( ':' ); // 把strategy 和参数分开
        this.cache.push(function(){ //把校验的步骤用空函数包装起来，并且放入cache
            var strategy = ary.shift(); // 用户挑选的strategy
            ary.unshift( dom.value ); // 把input 的value 添加进参数列表
            ary.push( errorMsg ); // 把errorMsg 添加进参数列表
            return strategies[ strategy ].apply( dom, ary);//委托给策略函数
        });
    };
    Validator.prototype.start = function(){
        for ( var i = 0, validatorFunc; validatorFunc = this.cache[ i++ ]; ){
            var msg = validatorFunc(); // 开始校验，并取得校验后的返回信息
            if ( msg ){ // 如果有确切的返回值，说明校验没有通过
                return msg;
            }
        }
    };
```

使用策略模式重构代码之后,我们仅仅通过“配置”的方式就可以完成一个表单的校验, 这些校验规则也可以复用在程序的任何地方,还能作为插件的形式,方便地放到其他项目中。 



## 参考资料

1. 《设计模式—可复用面向对象软件的基础》，作者: [美] Erich Gamma等，机械工业出版社
2. 《Head First 设计模式》作者: 弗里曼，中国电力出版社
3. 《JavaScript设计模式与开发实践》 作者:曾探，人民邮电出版社
4. 《JavaScript高级程序设计》作者：Nicholas C.Zakas，人民邮电出版社


