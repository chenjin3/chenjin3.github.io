---
layout: post
title: JavaScript设计模式（一）
date: {}
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
* [原型模式](#user-content-原型模式)
* [工厂模式](#user-content-工厂模式)
* [职责链模式](#user-content-职责链模式 "职责链模式与电商预购应用")
* [命令模式](#user-content-命令模式)
* [策略模式](#user-content-策略模式)

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

如上所示，对象会记住它的原型，JavaScript给对象提供了一个名为__proto__的隐藏属性（在chrome和firefox上可以访问到），对象的__proto__属性默认会指向它的构造器的原型对象,即{Constructor}.prototype。该属性是对象跟对象构造器的原型联系起来的纽带。如果对象无法响应某个请求，他会把这个请求委托给他的构造器的原型对象。请求顺着原型链传递下去,直到遇到一个可以处理该请求的对象为止。这就是原型继承得以实现的原因，下面这段代码将b对象的构造器B的原型指向对象a，让b对象能够借用a对象的能力。

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


## 参考资料
1. 《设计模式—可复用面向对象软件的基础》，作者: [美] Erich Gamma等，机械工业出版社
2. 《Head First 设计模式》作者: 弗里曼，中国电力出版社
3. 《JavaScript设计模式与开发实践》 作者:曾探，人民邮电出版社
