var app = require('./route');
var url = require('url');
var util = require('util');

module.exports = app;



app.get('/test/:username', function(req,res,next){
	console.log(3);
	next();
} ,function(req, res,next){
	res.writeHead(200,{'Content-Type': 'text/html'});
	res.write('404 Not Found\n');
	res.write('414 Not Found\n');
	console.log(4);
	res.end();
});

app.use(function(err,req,res,next){
	var pathname = url.parse(req.url).pathname;
	if(pathname !== '/favicon.ico'){
		console.log('err:','err1');
	}
	next(err);
},function(err,req,res,next){
	var pathname = url.parse(req.url).pathname;
	if(pathname !== '/favicon.ico'){
		console.log('err:','err2')
	}
	res.writeHead(200,{'Content-Type': 'text/html'});
	res.end();
})

app.use(function(req,res,next){
	
	var pathname = url.parse(req.url).pathname;
	//console.log(pathname)
	if(pathname !== '/favicon.ico'){
		console.log(1)
	}
	asd();
	next();
	//res.end();
});
app.use(function(req,res,next){
	
	var pathname = url.parse(req.url).pathname;
	//console.log(pathname)
	if(pathname !== '/favicon.ico'){
		console.log(2)
	}
	next();
	//res.end();
});






