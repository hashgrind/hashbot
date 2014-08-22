(function () {
	'use strict';
	
	var _ = require('lodash');
		
	/**
	* Public constructor that returns a new Bot given a configuration object config.
	* config should contain at least one field:
	* client: an IRC client.
	*/
	function Bot (config) {
		var guts = new (require('../botGuts'))();
		var handler = new (require('../msgHandler'))();
		
		config.client.on('registered', function (msg) {
			guts.setNameFromMessage(msg);
		});
		
		config.client.on('message', function (nick, to, text, message) {
			//console.log('observed message from nick', nick, 'to', to, 'with text', text, 'and message', message);
			
			handler.parseMessage(text, function (outVal) {
				if (!guts.isMessageToUs(message)) {
					// Message was not to us; send back to 'to' (channel)
					config.client.say(to, [nick, ': ', outVal].join(''));
				} else {
					// Message was to us privately, so send a direct message back
					config.client.say(nick, outVal);
				}
			});
		});

		config.client.addListener('error', function (message) {
			config.client.say("Something went wrong. I.e., you fucked it up.");
		});
	}
		
	module.exports = Bot;
}).call();