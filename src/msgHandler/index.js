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
		'!help': {
			'in': function (input, cb) {
				_(this._knownCommands).where('help').forEach(function (cmd) {
					cb(cmd.help());
				});
			},
			'out': function (val) {
				return val;
			},
			'help': function () {
				return "`!help': You're reading it";
			}
		},
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
			},
			'help': function () {
				return "`!btc': Fetch the current market price of Bitcoin from Blockchain.info";
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
			},
			'help': function () {
				return "`!sha1 val': Hash val with SHA1";
			}
		},
		'!encode': {
			'in': function (input, cb) {
				if (input.length >= 4) {
					// cmd, from, to, data

					var inFormat = input[1], outFormat = input[2];
					var outputs = [];

					_(input).rest(3).forEach(function (arg) {
						outputs.push(new Buffer(arg, inFormat).toString(outFormat));
					});
					
					cb(outputs.join(' '));
				}
			},
			'out': function (val) {
				return val;
			},
			'help': function () {
				return "`!encode inFmt outFmt arg1 [arg2 [... argn]]': Reencode each arg from inFmt to outFmt (e.g., utf8, ascii, base64, hex, etc. -- see http://nodejs.org/api/buffer.html#buffer_buffer)";
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
			},
			'help': function () {
				return "`!reddit [val]': Fetch a random link from the r/val reddit, defaulting to random";
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
			},
			'help': function () {
				return "`!lfa val1 [val2 [val3 [... valn]]]': Perform a letter frequency analysis on the vals";
			}
		},
		'!rot': {
			'in': function (input, cb) {
				if (input.length >= 3) {
					// Just avoiding magic numbers
					var alphabetLength = 26;

					var asciiConsts = {};
					_(['A', 'Z', 'a', 'z']).forEach(function (chr) {
						asciiConsts[chr] = chr.charCodeAt(0);
					});

					// Get the shift value
					var shift = _.parseInt(input[1]);
					while (shift < 0) {
						shift += alphabetLength;
					}

					// Get the inputs to transform (recall args 0 and 1 are command and shift value)
					var charArrays = [];
					_(input).rest(2).forEach(function (word) {
						charArrays.push(word.split(''));
					});

					// Written for high readability more than speed
					_(charArrays).forEach(function (charArr) {
						for (var i = 0; i < charArr.length; i++) {
							charArr[i] = charArr[i].charCodeAt(0);

							var shiftFloor = null;
							if (charArr[i] >= asciiConsts.A && charArr[i] <= asciiConsts.Z) {
								shiftFloor = asciiConsts.A;
							} else if (charArr[i] >= asciiConsts.a && charArr[i] <= asciiConsts.z) {
								shiftFloor = asciiConsts.a;
							}

							if (!_.isNull(shiftFloor)) {
								charArr[i] += shift - shiftFloor;
								charArr[i] %= alphabetLength;
								charArr[i] += shiftFloor;
							}
						}
					});

					cb(charArrays);
				}
			},
			'out': function (codeArrays) {
				codeArrays = _(codeArrays)
					.map(function (codeArray) {
						codeArray = _(codeArray)
							.map(function (code) {
								return String.fromCharCode(code);
							})
							.valueOf();

						return codeArray.join('');
					})
					.valueOf();
				return codeArrays.join(' ');
			},
			'help': function () {
				return "`!rot shift arg1 [arg2 [... argn]]: Perform an affine transformation (aka rotational cipher (aka Caesar cipher)) on the argi's'";
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

				try {
					cmdHash.in.call(this, arr, function (outValue) {
						cb(cmdHash.out(outValue));
					});
				} catch (ex) {
					cb("Something went wrong. I.e., you fucked it up.");
				}
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