var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

http.createServer(function(req, res){
	//错误：pathname小写
	var pathname = url.parse(req.url).pathname;

	var body = '';

	//先去查找静态文件，如果没找到，去查找路由，如果都没找到，您访问的路径不存在
	//也可以根据注册的路由做排除列表
	fs.readFile(path.join(__dirname,pathname), function(err,file){
		if(err){

			if(pathname == '/upload'){
				req.on('data', function(chunk){
					body += chunk;	
				});

				req.on('end', function(){

					//var params = url.parse(body,true);
					res.writeHead(200,{'Content-Type':'text/plain'});
					res.body = body
					res.end(body);

				});
			}else{
				//console.log(pathname);
				res.writeHead(404);
				res.end('文件未找到');
			}
		}else{
			res.writeHead(200);
			//错误2不应该将html以文本形式返回
			//res.writeHead(200,{'Content-Type':'text/plain'});

			res.end(file);
		}
	});


	//先解析路由，再解析静态文件地址，
	// if(pathname == '/upload'){

	// 	req.on('data',fn);
	// 	req.on('end',fn)

	// }else{

	// 	fs.readFile('path',function(err,file){

	// 		if(err){
	// 			res.end('文件未找到')
	// 		}

	// 		res.send(file)
	// 	})

	// }

}).listen(2500);