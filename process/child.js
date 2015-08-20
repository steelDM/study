var http = require('http');
var url = require('url');
var log4js = require('log4js');

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: './test.log', category: 'app'}
  ]
});

var logger = log4js.getLogger('app');

var server = http.createServer(function(req,res){
	res.writeHead(200,{'Content-Type':'text/plain'});
	res.end('handle by child, pid is'+ process.pid +'\n');
	//console.log(url.parse(req.url).pathname);
	if(url.parse(req.url).pathname !== '/favicon.ico'){
		throw new Error('throw exception');	
	}
});


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
process.on('uncaughtException',function(err){
	//记录日志
	//console.log(err);
	logger.error(err);

	process.send({act:'suicide'});
	//断开所有有链接后，退出进程
	worker.close(function(){
		process.exit(1);
	});
	//5秒后强制退出
	setTimeout(function(){
		process.exit(1);
	},5000);
});

