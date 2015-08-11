var http = require('http');
var helloword ='';

for(var i=0;i<1024*10;i++){
    helloword += "a";
}
//helloword = new Buffer(helloword);
http.createServer(function(req,res){
    res.writeHead(200);
    res.end(helloword);
}).listen(3000);
