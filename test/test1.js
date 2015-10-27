var abc = "10";


var http = require('http'),
    httpProxy = require('http-proxy');

var connect = require('connect');
var serveStatic = require('serve-static');
var path = require('path');
var url  = require('url');
var express = require('express');
var pathToRegexp = require('path-to-regexp')
// Create your proxy server and set the target in the options.

var routerMap = require('./routerConfig').routers;
var app = connect();
//var app = express();

var mime = {
	'.png': 'image/png',
	'.gif': 'image/gif',
	'.jpg': 'image/jpeg',
	'.css': 'text/css',
	'.html': 'text/html',
	'.htm': 'text/html',
	'.js': 'application/x-javascript',
	'.shtml': 'text/html',
	'.jpeg': 'image/jpeg',
	'.ico': 'image/x-icon',
	'.json': 'application/json',
	'.jpe': 'image/jpeg',
	'.zip': 'application/zip',
	'.rar': 'application/x-rar-compressed'
};

//

//
// Create your target server
//

// for(var i in routers){
// 	var key = i;
// 	var val = routers[i];

// }


// app.use('/common', function fooMiddleware(req, res, next) {
//   console.log(__dirname);
//   res.end();
//   //next();
// });

//''
app.use(serveStatic(process.cwd() +'/',{
  maxAge: '1d',
  setHeaders: function(res, p, stat){

  	var ext = path.extname(p).toLowerCase();

  	res.setHeader('Content-Type', mime[ext]);
  	// console.log();
  	// console.log(path);
  	// console.log(stat);
  }

}));


app.use(function(req,res,next){
	var location = url.parse(req.url);

	var routers = routerMap[location.hostName];

	routers.forEach(function(o,i){

		var reg = o.regexp;
		var handler = o.handler;

		if(location.path.match(req)){
			handler();
		}

	});

	next();

});



app.use('/', function fooMiddleware(req, res, next) {

  //var hostName = 
  
  console.log(url.parse(req.url));
  console.log(__dirname);
  console.log(111111);
  res.end();
  //next();
});



http.createServer(app).listen(8080);


//httpProxy.createProxyServer({target:'http://127.0.0.1:9033'}).listen(8080);

