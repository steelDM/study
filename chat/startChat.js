var express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

var iosever = require("./sever");

var path = require('path');


iosever.chatSever(io);    

server.listen(8000);
console.log(__dirname)
app.use(express.static(path.join(__dirname)));
