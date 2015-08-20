var util = require('util');
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var fs = require('fs');

util.inherits(Wraper, Readable);
util.inherits(WW, Writable);

//数据控制流程和数据产生流程的解耦
//wraper主要控制数据流，需要实现ondata和onend方法
//counter需要实现数据的生成，restart,readstop方法

//控制数据流
function Wraper(options){
	Readable.call(this,options);

	this._source = Counter(options);
	var self = this;
	this._source.ondata = function(chunk){
		if(!self.push(chunk)){
			self._source.readStop();
		}
	}

	this._source.onend = function(){
		self.push(null);
	}
}

Wraper.prototype._read = function(size) {
	this._source.readStart();
};

//创建数据流
function Counter(opts){

	var i = 0;
	var max = opts.max;

	return {
		ondata:null,
		onend: null,
		readStart: function(){
			//用for就是一次读取完毕了,应该使用if
			if(++i < max){
				var str = '' + i;
				var buf = new Buffer(str+' \n','utf-8');
				//加入到读取队列。
				//返回false时，停止推入
				this.ondata(buf);
			}else{
				this.onend();
			}
		},
		readStop:function(){
			//如何让程序挂起呢
			//不读取数据
			return false;
		}
	}
}


function WW(options){

	Writable.call(this,options);
}
WW.prototype._write = function(chunk, encoding, callback){
	console.log(1)
	try{
		chunk = chunk.toString() + 'jiagong\n';

		chunk = new Buffer(chunk,'utf-8');
		console.log(this.push);
		//处理完一个数据后
		//可以自己使用想写哪写哪
		wr.write(chunk);
	}catch(err){
		callback&&callback(err);
	}

	callback&&callback();
}


var wr = fs.createWriteStream('./5.txt');
//创建一个readable流
var rs = new Wraper({max:1000});
var ww = new WW();
//当有消费的时候，开始读取readable内部的_read方法，获取chunk
rs.on('data', function(chunk){
	console.log('正在传递');
	ww.write(chunk);
	//wr.write(chunk);
});

rs.on('end', function(){
	console.log('传递结束');
});