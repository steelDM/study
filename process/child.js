var http = require('http');
var server = http.createServer(function(req,res){
	res.writeHead(200,{'Content-Type':'text/plain'});
	res.end('handle by child, pid is'+ process.pid +'\n');
})


//m is messageName
process.on('message',function(m, tcp){
	if(m === 'server'){
		tcp.on('connection', function(socket){
			//让子进程去接管请求
			server.emit('connection', socket);
			//socket.end('handle by child, pidis'+process.pid +'\n');
		});
	}
});
