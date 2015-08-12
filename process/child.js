var http = require('http');
var server = http.createServer(function(req,res){
	res.writeHead(200,{'Content-Type':'text/plain'});
	res.end('handle by child, pid is'+ process.pid +'\n');
})


//m is messageName
var worker;
process.on('message',function(m, tcp){
	if(m === 'server'){
		worker = tcp;
		worker.on('connection', function(socket){
			//让子进程去接管请求
			server.emit('connection', socket);
			//socket.end('handle by child, pidis'+process.pid +'\n');
		});
	}
});
//console.log('child process:',process);
//代码错误导致进程退出
process.on('uncaughtException',function(){
	process.send({act:'suicide'});
	//断开已有链接后，退出进程
	worker.close(function(){
		process.exit(1);
	});

});