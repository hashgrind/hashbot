(function () {
	'use strict';
	
	var _ = require('lodash');
	
	/**
	* Sort of a private class, because the notion of 'this' is annoyingly clobbered in JS,
	* in particular in the IRC client class callbacks, and the Bot object becomes a public
	* facade that isn't all of the bot in actuality.
	*/
	function BotGuts() {}
	
	BotGuts.prototype.name = '';
	
	BotGuts.prototype.setNameFromMessage = function (msg) {
		this.name = msg.args[0];
	};
	
	BotGuts.prototype.isMessageToUs = function (msg) {
		return _.isEqual(msg.args[0], this.name);
	};
	
	module.exports = BotGuts;
}).call();