(function () {
	'use strict';
	
	var argv = require('optimist').argv;

	var botLauncher = new (require('./src/botLauncher'));

	if (!botLauncher.checkArgv(argv)) {
		console.log("Required launch arguments:", botLauncher.requiredProperties);
		process.exit(1);
	} else {
		botLauncher.createBot(argv);
	}
}).call();
