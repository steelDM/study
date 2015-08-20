var http = require('http');
var fs = require('fs');

var read = fs.createReadStream('./2.mp4');
var write = fs.createWriteStream('./3.mp4');

//当缓冲区消耗完毕后，从新读取触发readable事件
//在某些情况下，假如未准备好，监听一个 'readable' 事件会使得  一些 数据从底层系统被读出到内部缓冲区中。可能形成内存泄露
// read.on('readable', function(){
// 	console.log('开始读取');
// 	var data = read.read();
// 	write.write(data);
// 	console.log(data);		
// });

//数据会尽可能多的读取，如果消费速度远远小于读取速度，数据会囤积在内存中，形成内存泄露
//切换到流动模式，
// read.on('data', function(chunk){
// 	read.pause();
// 	//read 从内部缓冲区中拉取并返回若干数据，并非从文件读取
// 	//该方法仅应在暂停模式时被调用
	
// 	//console.log(chunk);
// });

read.resume();

//数据读取完毕触发，可以通过手动read读取触发
read.on('end', function(chunk) {
	var data = read.read();
	console.log(data);	
	console.log(chunk);
	console.log('读取完毕。');
});
// a.pipe(b);




//当创建一个流的时候，流默认是暂停的，监听data事件使流变成流动的，并且消费了流