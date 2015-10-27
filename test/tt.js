var git = require('gitty');
var Q = require('q');
var myRepo = git('../../study');

function getStatus(){
	var deferred = Q.defer();

	myRepo.status(function(err, status) {
		
		console.log('获取状态成功，改动文件：', status);
		deferred.resolve(status);
	})	

	return deferred.promise;	
}

function addFile(status){
	var deferred = Q.defer();

	var filesArray = [];

	status.unstaged.forEach(function(item,i){
		filesArray.push(item.file);
	});

	myRepo.add(filesArray,function(err){

		console.log('提交完成');
		deferred.resolve();

	});

	return deferred.promise;	
}

function commit(){
	var deferred = Q.defer();
	myRepo.commit('node发布测试',function(err,result){
		console.log('提交完成',result);
		deferred.resolve();
	});

	return deferred.promise;
}

function push(){
	var deferred = Q.defer();

	myRepo.push('local', 'master',function(err, result) {

		console.log('push 完毕');
    	
    	//deferred.resolve();
    });

    return deferred.promise;  
}

getStatus().then(addFile).then(commit).then(push);


// myRepo.add(function(err, status) {
// 	//if (err) return
// 	console.log(status);
// 	// ...
// })