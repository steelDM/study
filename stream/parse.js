var http = require('http');
var util = require('util')

http.createServer(function(req, res){

	res.writeHead(200,{'Content-Type':'application/json'});

	res.end(util.inspect(req));

}).listen(3000);