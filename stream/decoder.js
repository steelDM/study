var http = require('http');
var fs = require('fs');

var re = fs.createReadStream('./2.mp4');
var wr = fs.createWriteStream('./3.mp4');

var ok = true;

// re.on('data', function(chunk){

// 	ok && (ok = wr.write(chunk));

// 	//once执行一次事件
// 	!ok && wr.once('drain', function(){
// 		console.log('once');
// 		wr.write(chunk);
// 	})
// });


re.on('data', function(chunk){
	wr.cork();
	//滞留所有write操作至缓存，但必须有写
	wr.write(chunk);
//	process.nextTick(function(){wr.uncork();console.log('解锁解锁')})
});


re.on('end', function(){
	wr.end();
	console.log('已经结束');
})