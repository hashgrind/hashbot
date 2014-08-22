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

`!help` gives you help.

`!btc` gives you the current market price for Bitcoin, according to Blockchain.info.

`!sha1 val` will give you the SHA1 hash value of `val`, in hex.

`!encode input inFmt outFmt` will use node Buffers to reencode `input` from `inFmt` to `outFmt` (see http://nodejs.org/api/buffer.html#buffer_buffer).

`!reddit [reddit]` will fetch a random link from the subreddit named `reddit`, or will use `random` as `reddit` if omitted.

`!lfa arg1 [arg2 [arg3 [... argn]]]` performs a letter frequency analysis on the characters of all the arguments.

`!rot shift arg1 [arg2 [... argn]]` performs a rotational cipher of order `shift` to each `argn` in such a way that ignores non-letter values.

# License

MIT
