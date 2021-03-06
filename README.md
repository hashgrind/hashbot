# hashbot

This silly IRC bot knows just a few tricks.

If you message it privately, it will respond privately. Otherwise, it will respond on the channel in which you find it.

## Usage

After you `npm install`, just

```
$ node index.js --server irc.example.com --port 6697 --username whateverbot --channels '#chan1 #chan2'
```

e.g.

## Commands

`!help [!cmd]` gives you help, optionally about the command `!cmd'.

`!btc` gives you the current market price for Bitcoin, according to Blockchain.info.

`!sha1 val` will give you the SHA1 hash value of `val`, in hex.

`!encode inFmt outFmt arg1 [arg2 [... argn]]` will use node Buffers to reencode each argument from `inFmt` to `outFmt` (see http://nodejs.org/api/buffer.html#buffer_buffer).

`!reddit [reddit]` will fetch a random link from the subreddit named `reddit`, or will use `random` as `reddit` if omitted.

`!lfa arg1 [arg2 [... argn]]` performs a letter frequency analysis on the characters of all the arguments.

`!rot shift arg1 [arg2 [... argn]]` performs a rotational cipher of order `shift` to each argument, leaving non-letter values untouched.

# License

MIT
