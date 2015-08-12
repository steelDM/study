var fork = require('child_process').fork;
var cpus = require('os').cpus();

var server = require('net').createServer();
server.listen(1337);


var childs = {};

var createrChild = function(){
	var child = fork(__dirname + '/child.js');
	
	//退出时重新启动新进程，删除重建
	//进程正常退出时事件监听
	child.on('exit', function(){
		console.log('Worker' + child.pid + 'exited');
		delete childs[child.pid];
		createrChild()
	});
	child.on('message',function(message){
		//if()

	});
	child.send('server', server);
	console.log('master pid:',process.pid);
	childs[child.pid] = child;
	console.log('Create worker pid:',child.pid);
}

for(var i = 0;i<cpus.length;i++){
	createrChild();
}

//主进程退出，退出所有子进程
process.on('exit', function(){
	for(var pid in childs){
		childs[pid].kill();
	}
});