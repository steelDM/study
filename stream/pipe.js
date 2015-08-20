var stream = require('stream');
var rs = require('fs').createReadStream('./3.txt');
// var ws = require('fs').createWriteStream('./5.txt');

// rs.on('data', function(chunk){

// 	ws.write(chunk+'11111');

// });

// ws.on('pipe', function(chunk){

// 	//console.log(chunk);
// });

// console.log(rs.destroy);

process.stdin.pipe(process.stdout);



