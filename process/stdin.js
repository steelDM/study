// var stream = require('stream');
// var Writable = stream.Stream;

// var ws = new Writable();
// ws.writable = true;


// console.log(ws);


// console.log(ws);


// ws.write = function(data){
// 	console.log('input='+data);
// };

// ws.end = function(){
// 	console.log('end1');
// }
//process.stdin.pipe(ws);


var Writable = require('stream').Writable;
var ws = Writable();

process.stdin.on('data', function(data){

	console.log('input='+data);
});

process.stdin.on('end', function(){
	console.log('end');
});

ws._write = function (chunk, enc, next) {
    console.log(chunk);
    next();
};

process.stdin.pipe(ws)