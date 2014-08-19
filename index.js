(function () {
	'use strict';
	
	var
		server = 'chat.freenode.net',
		port = 6697,
		connectRetries = 1,
		//channel = '#socialgeeks',
		//channel = '#dc614',
		channel = '##hashBotTest',
		username = 'hash-bot';
	
	var irc = require('irc');
	
	var client = new irc.Client(server, username, {
		userName: username,
		realName: username,
		port: port,
		secure: true,
		floodProtection: true,
		sasl: true,
		debug: true,
		autoConnect: true,
		channels: [channel]
	});
	
	var bot = new (require('./src/bot'))({
		'client': client
	});
}).call();