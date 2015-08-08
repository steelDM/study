var http = require('http');
var url = require('url');


http.createServer(function(req,res){

	//var pathname = url.parse(req.url).pathname;

	//if(pathname=="/test"){

	//res.setHeader('Content-Type','text/plain');
	//res.statusCode = 302;
	res.setHeader('Location','http://www.baidu.com');
//res.writeHead(302, {'Location': 'https://www.baidu.com'});
//res.end();

	res.writeHead(302);

	res.end('Redirect to baidu');


	//}

}).listen(2000);