(function () {
	'use strict';

	var _ = require('lodash'),
		irc = require('irc');

	function BotLauncher(){}

	BotLauncher.prototype.requiredProperties = ['server', 'port', 'username', 'channels'];

	BotLauncher.prototype.checkArgv = function (argv) {
		return _.isObject(argv) && _.every(this.requiredProperties, function (prop) {
			return argv.hasOwnProperty(prop);
		});
	};

	BotLauncher.prototype._createClient = function (argv) {
		return new irc.Client(argv.server, argv.username, {
			userName: argv.username,
			realName: argv.username,
			port: argv.port,
			secure: true,
			floodProtection: true,
			sasl: true,
			debug: true,
			autoConnect: true,
			channels: argv.channels.split(/\s+/)
		});
	};

	BotLauncher.prototype.createBot = function (argv) {
		return new (require('../bot'))({
			'client': this._createClient(argv)
		});
	};

	module.exports = BotLauncher;
}).call();