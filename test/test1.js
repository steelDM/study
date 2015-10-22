var exec = require('child_process').exec;
	cmd = 'npm root -g';
	exec(cmd, function callback(error, stdout, stderr) {

		console.log(stdout);
	});