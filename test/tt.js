var Client = require('ssh2').Client;

var conn1 = new Client();
var conn2 = new Client();

conn1.on('ready', function() {
  console.log('FIRST :: connection ready');
  conn1.exec('nc 45.33.47.221 22', function(err, stream) {

    if (err) {
      console.log('FIRST :: exec error: ' + err);
      return conn1.end();
    }
    conn2.connect({
      sock: stream,
      username: 'root',
      password: 'Wangdidi102616!'
    });
  });
});

conn2.on('ready', function() {
  console.log('SECOND :: connection ready');
  conn2.exec('uptime', function(err, stream) {
    if (err) {
      console.log('SECOND :: exec error: ' + err);
      return conn1.end();
    }
    stream.on('end', function() {
      conn1.end(); // close parent (and this) connection
    }).on('data', function(data) {
      console.log(data.toString());
    });
  });
});

conn1.connect({
  host: '127.0.0.1',
  port: 2222,
  username: 'vagrant',
  password: 'vagrant'
});

// conn1.connect({
//   host: '45.33.47.221',
//   port: 22,
//   username: 'root',
//   password: 'Wangdidi102616!'
// });