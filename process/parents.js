var child1 = require('child_process').fork('./child.js');
var child2 = require('child_process').fork('./child.js');
var child3 = require('child_process').fork('./child.js');


//主进程，只负责分发，越轻越好
var server = require('net').createServer();

server.listen(1337,function(){

	//在这里做负载均衡
	child1.send('server',server);
	child2.send('server',server);
	child3.send('server',server);

	// server.close();
	server.close();
});
