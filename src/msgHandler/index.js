(function () {
	'use strict';
	
	var
		crypto = require('crypto'),
		request = require('request'),
		_ = require('lodash');
	
	function MsgHandler() {}
	
	/**
	* Abstract away the determination of whether or not we have a command available.
	* We'll keep the convention of lowercase command names, so lower the command as a convenience.
	*/
	MsgHandler.prototype.hasCommand = function (cmd) {
		return this._knownCommands.hasOwnProperty(cmd.toLowerCase());
	};
	
	MsgHandler.prototype.getCommand = function (cmd) {
		return this._knownCommands[cmd.toLowerCase()];
	};
	
	/**
	* Known bot commands, which is an object mapping commands to input and output functions,
	* along with descriptor functions, which will be called asynchronously.
	* It's sort of a poor man's map-reduce.
	*/
	MsgHandler.prototype._knownCommands = {
		'!btc': {
			'in': function (input, cb) {
				request('https://blockchain.info/ticker', function (error, response, body) {
					if (!error && response.statusCode === 200) {
						var obj = JSON.parse(body);
				
						var price = obj.USD.last;
				
						cb(price);
					}
				});
			},
			'out': function (price) {
				return 'Current Bitcoin market price is $' + price;
			}
		},
		'!sha1': {
			'in': function (input, cb) {
				var hash = crypto.createHash('sha1');
				
				if (input.length >= 2) {
					hash.update(input[1]);
				} else {
					hash.update('');
				}
				
				cb(hash.digest('hex'));
			},
			'out': function (hash) {
				return hash;
			}
		},
		'!encode': {
			'in': function (input, cb) {
				if (input.length >= 4) {
					// cmd, data, from, to
					
					cb(new Buffer(input[1], input[2]).toString(input[3]));
				}
			},
			'out': function (val) {
				return val;
			}
		},
		'!reddit': {
			'in': function (input, cb) {
				var reddit = (input.length >= 2) ? input[1] : 'random';
				
				request(['http://reddit.com/r', reddit, '.json'].join('/'), function (error, response, body) {
					if (!error && response.statusCode === 200) {
						var obj = JSON.parse(body);
						
						cb(_(obj.data.children).shuffle().first());
					}
				});
			},
			'out': function (child) {
				return ['https://reddit.com', child.data.permalink].join('');
			}
		},
		'!lfa': {
			'in': function (input, cb) {
				var hash = {};

				_(input)
					.rest()
					.forEach(function (val) {
						_(val.split('')).forEach(function (char) {
							if (hash.hasOwnProperty(char)) {
								hash[char]++;
							} else {
								hash[char] = 1;
							}
						});
					});

				cb(hash);
			},
			'out': function (hash) {
				return JSON.stringify(hash);
			}
		}
	};
	
	/**
	* Internal implementation of parseMessage that does the bulk lifting.
	*/
	MsgHandler.prototype._parseMessage = function (arr, cb) {
		if (_.isArray(arr) && arr.length >= 1) {
			if (this.hasCommand(arr[0])) {
				var cmdHash = this.getCommand(arr[0]);
				
				cmdHash.in(arr, function (outValue) {
					cb(cmdHash.out(outValue));
				});
			}
		}
	};
	
	/**
	* Parse an input message, arg, and deliver the result to callback cb.
	* arg may be either a string (which will be chopped into an array at whitespace)
	* or an array already.
	* cb will be called with a single argument, a string.
	*/
	MsgHandler.prototype.parseMessage = function (arg, cb) {
		if (_.isString(arg)) {
			this._parseMessage(arg.split(/\s+/), cb);
		} else if (_.isArray(arg)) {
			this._parseMessage(arg, cb);
		}
	};
	
	module.exports = MsgHandler;
}).call();