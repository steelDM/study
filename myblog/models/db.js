var settings = require('../dbconfig.js');
var DB = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;


module.export = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {}));