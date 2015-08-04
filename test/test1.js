var http = require('http');
var path = require('path');
var fs = require('fs');
var url = require('url');
var session = require('./session');

console.log(session);

 

//静态服务器 
// http.createServer(function(req,res){

// 	//url.parse 后就相当于浏览器中的location对象

// 	//获取请求路径
// 	var pathname = url.parse(req.url).pathname;

// 	//try to open path file
// 	console.log(path.join(__dirname,'resource',pathname));

// 	fs.readFile(path.join(__dirname,'resource',pathname), function(err, file){
// 		if(err){
// 			res.writeHead(404);
// 			res.end('can not find this file');
// 			return
// 		}

// 		res.writeHead(200);

// 		res.end(file);
		
// 	});
	
// 	//res.writeHead(200,{'Content-Type':'text/plain'})


// 	//res.end('hello world');

// }).listen(2500);


//通过路径进行分发

var handlers = {

	user:{

		index:function(req,res){
			//错误3:__filename 指的是当前文件路径
			fs.readFile(path.join(__dirname,'resource','index.html'), function(err, file){

				if(err){
					res.writeHead(404);
					res.end('opps something wrong');
					return
				}

				res.writeHead(200,{'Set-cookie': ['test=456;HttpOnly','sdda=123']});

				res.end(file);

			});

		}

	}

}

http.createServer(function(req, res){

	var paths = url.parse(req.url).pathname.split('/');
	var query = url.parse(req.url,true).query; //return {a:b}

	var controller = paths[1] || index;
	//错误1:路径拼写不对
	var action = paths[2];

	 //console.log('paths',paths);
// 	 console.log('controller:',controller);
// 	 console.log('action:', action);
// console.log(handlers[controller]);
	if(handlers[controller] && handlers[controller][action]){
		//错误2:参数传递反了
		handlers[controller][action].apply(null,[req,res]);
	}else{

		res.writeHead(500);
		res.end('can not find page');

	}

}).listen(2500);

