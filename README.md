# curl2xh

`curl2xh` converts [curl](https://curl.se/) commands to [`xh`](https://github.com/ducaale/xh).
Use it as a drop-in replacement for `curl` when you want to see the equivalent
`xh` invocation.

```sh
$ curl2xh https://example.com
xh https://example.com
```

The tool supports many common curl flags and prints warnings for unsupported
options when `--verbose` (or `-v`) is provided.

Pass `-` or `--stdin` to read the curl command from standard input.
