# Emoji keyboard

## Story Time

Hello, there! I'm Tomas and I wrote emoji-keyboard years ago. It was never a passion project, I was just highly annoyed by all available means of using emoji on Linux at the time. It's 2022 and using emoji on Linux is still a PITA. At least we got system wide color emoji.

Since it's not a passion project (and I got plenty of those), it doesn't pay for itself, and I even got a proper job now, I will likely not be maintaining this package much.

That said I did rewrite the app last spring, using rust and third-party libraries to optimize performance and maintenance cost. And then forgot to release it.

So here I am releasing the latest version (4.0.0)
with react-native front end, rust + c backend, and much simplified and reduced code base.

If you find new bugs here, do open an issue. Just know that I have no time for this and it takes me about a year to fix things unless they affect me personally.

## Changes

- Much smaller bundles. No more bundled emoji sets, since every system out there supports color emoji. No more electron, I still like electron, but tauri fits better for a small utility like this.
- Fewer settings and features. Just what I use personally, otherwise I don't even remember how to fix these things even if I get the time.
