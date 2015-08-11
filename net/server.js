
//传输的数据全部是以二进制进行传输
// write方法用来传递消息和数据
var list = [];
var net = require('net');
var server = net.createServer(function(socket){
	//new connection
	list.push(socket);

	socket.on('data',function(data){
		console.log(data.toString());
		socket.write("hello");
		list.forEach(function(s){
			console.log('writable:',socket.writable);
		});
	});
	
	socket.on('end',function(){
		console.log('disconnect');
	});

	socket.write('welcome to nodejs');
});

server.listen(3000, function(){
	console.log('server bound');
});
