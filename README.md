# hashbot

This silly IRC bot knows just a few tricks.

If you message it privately, it will respond privately. Otherwise, it will respond on the channel in which you find it.

## Commands

`!btc` gives you the current market price for Bitcoin, according to Blockchain.info.

`!sha1 val` will give you the SHA1 hash value of `val`, in hex.

`!encode input inFmt outFmt` will use node Buffers to reencode `input` from `inFmt` to `outFmt` (see http://nodejs.org/api/buffer.html#buffer_buffer).

`!reddit [reddit]` will fetch a random link from `r/*reddit*`, or will use `random` as `reddit` if omitted.

# License

MIT
