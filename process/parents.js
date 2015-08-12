
var cuups =require('os').cpus();
var fork = require('child_process').fork;
// var child1 = require('child_process').fork('./child.js');
// var child2 = require('child_process').fork('./child.js');
// var child3 = require('child_process').fork('./child.js');


//主进程，只负责分发，越轻越好
var server = require('net').createServer();
//listen监听
server.listen(1337,function(){

	for(var i=0;i<cuups.length;i++){

		fork('./child.js').send('server',server)

	}

	server.close();
});
