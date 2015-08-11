// var net = require('net');
// 错误❌port拼错了
// var client = net.connect({prot:3000},function(){
// 	console.log('client connectd');
// 	client.write('world!')
// });

// client.on('data',function(data){
// 	console.log(data.toString());
// 	client.end();
// });

// client.on('end',function(){
// 	console.log('client disconnected');
// });


//write方法是发送信息
var net = require('net');
var client = net.connect({port: 3000},
    function() { //'connect' 监听器
  console.log('client connected');

  //
  client.write('world!\r\n');
});
client.on('data', function(data) {
  console.log(data.toString());
  client.end();
});
client.on('end', function() {
  console.log('客户端断开连接');
});
