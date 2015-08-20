// 在您的实现代码中，十分重要的一点是绝对不要调用上文面向流消费者的 API 中所描述的方法，否则可能在消费您的流接口的程序中产生潜在的副作用。
var stream = require('stream');
var fs = require('fs');
var Readable = stream.Readable;

var until = require('util');

//继承Readable方法
until.inherits(Counter, Readable);

//创建构造函数
//opt可以包含内置参数设置，需要的自己的参数设置
function Counter(opt){
	// 在您的构造函数中调用父类的构造函数，以确保内部的机制被正确初始化。
	Readable.call(this, opt);
	this._max = opt.max;
	this._index = 1;
}

// 这里不经过特殊处理不要使用对象字面量
// 问题：原型链断裂和覆盖父类方法
// 覆盖readable内部的读取方法的
// _read() 不会被再次调用，直到至少调用了一次 push(chunk)。

//stream.read(0)可以触发底层刷新，调用_read但不会读取任何数据，数据依然存在缓存中
Counter.prototype._read = function(){
	var i = this._index++;
	console.log(i);
	if(i > this._max){
		//push null 输出数据结束
		this.push(null);
	}else{
		var str = ''+i;
		var buf = new Buffer(str+' \n','utf-8');
		//加入到读取队列。
		//返回false时，停止推入
		this.push(buf);
	}
}

var wr = fs.createWriteStream('./5.txt');
//创建一个readable流，并且数据是通过每次调用_read时产生，所以_read中的变量不能是局部变量var i = this._index++;
var rs = new Counter({max:1000});

//当有消费的时候，开始读取readable内部的_read方法，获取chunk
rs.on('data', function(chunk){

	wr.write(chunk);
});

rs.on('end', function(){
	console.log('传递结束');
});