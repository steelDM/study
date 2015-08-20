var fs = require('fs');
var Transform = require('stream').Transform;
var inherits = require('util').inherits;
var a = fs.createReadStream('./2.mp4');

console.log(a);

function copy(option){
	Transform.call(this, option);
	this.temple = fs.createWriteStream(option.path);
	var that = this;
	this.temple.on('drain', function(){
		that.resume();
	});
}

inherits(copy, Transform);

//_transform 方法来接受输入并产生输出。
//读取写入不同步，并不是done执行完毕后才会继续读取
copy.prototype._transform = function (chunk, encoding, done) {
	
	//这里是同步的callback
	//产生输出
	//var that = this;
	//this.pause();
	// var b = this.temple.write(chunk, function(){
	// 	that.resume();
	// 	done();
	// });

	var b = this.temple.write(chunk);
	//this.相当于一个readable对象
	if(b === false){
		this.pause();
	}
	
	//作为一个transform不管何时transfor.push都应该执行，以便数据可以顺利传递下去	
	this.push(chunk);
	done()
}


// readStream.on('data', function(chunk){
// 	//如果不能继续写入
// 	var std = writeStream.write(chunk);

// 	if(std == false){
// 		//这个函数应该被 Readable 实现者调用，而不是Readable 流的消费者。
// 		//暂停读取数据
// 		readStream.push();
// 	}
// 	console.log(std);
// });
// //如何阻塞释放，可以继续读取数据
// writeStream.on('drain', function(chunk){
// 	//让数据流继续流动，继续读取数据
// 	readStream.resume();
// });

// readStream.on('end', function(){
// 	writeStream.end();
// });

//pipe
//该方法从可读流中拉取所有数据，并写入到所提供的目标。
//该方法能自动控制流量以避免目标被快速读取的可读流所淹没。


a.pipe(new copy({'path':'./5.mp4'})).pipe(new copy({'path':'./6.mp4'}));
//console.log(a);
//a.pipe(writeStream1);