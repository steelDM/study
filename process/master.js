var fork = require('child_process').fork;
var cpus = require('os').cpus();

var server = require('net').createServer();
server.listen(1337);

var childs = {};
var restartLimit = 10;
var restartDuring = 60000;
var restart = []
var isTooFrequently = function(){
	var time = Date.now();
	var length = restart.push(time);
	//重启次数超过限制
	if(length>restartLimit){
		//取出最后10个记录
		restart = restart.slice(limit*-1);
	}
	//最后一次重启到前十次重启间隔；
	return restart.length>=limit && (restart[restart.length-1]-restart[0] < during);
};

var createrChild = function(){
	//检查是否太过频繁
	if(isTooFrequently()){
		//触发giveup事件后不再重启
		process.emit('giveup');
		return;
	}
	var child = fork(__dirname + '/child.js');
	//退出时重新启动新进程，删除重建
	//进程正常退出时事件监听
	child.on('exit', function(){
		console.log('Worker' + child.pid + 'exited');
		delete childs[child.pid];
		//createrChild()
	});
	child.on('message',function(message){
		if(message.act == 'suicide'){
			createrChild();
		}
	});
	child.send('server', server);
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