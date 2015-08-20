var net = require('net');
var server = net.createServer({ allowHalfOpen: false
},function(c) { // 'connection' 监听器
  console.log('服务器已连接');
  c.on('end', function() {
    console.log('服务器已断开');
  });
  c.write('hello\r\n');

  // 缺省情况下当来源流触发 end 时目标的 end() 会被调用，
  // 所以此时 destination 不再可写。传入 { end: false } 作为 options 可以让目标流保持开启状态。
  // c.on('data', function(chunk){
  // 	c.write(chunk)
  // });

  c.pipe(c,{end:false});

});
server.listen(8124, function() { // 'listening' 监听器
  console.log('服务器已绑定');
});

// var net = require('net');

// var server = net.createServer(function(socket){

// 	socket.on('data', function(chunk){
// 		console.log(chunk.toString())
// 		socket.write(chunk);

// 	});

// 	socket.pipe(socket);
// });
// server.listen(1337);