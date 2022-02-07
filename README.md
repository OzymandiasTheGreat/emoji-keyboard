# Emoji keyboard

Virtual keyboard-like emoji palette for Linux.

Emoji support on Linux is shaky at best. Modern distributions finally support
displaying color emoji, but using emoji is inconsistent and inconvenient.

Enter `emoji-keyboard`! Press a hotkey (default `Ctrl+Super+Space`) or choose `Palette`
from app indicator and an emoji palette opens. Then just click on emoji you want to use
and watch them appear in the active application!

> **Tip:** hold shift when using the terminal and you can type emoji into the terminal

> **Tip:** you can choose to copy emoji into the clipboard instead in the `Preferences`

Easy.

Not sure which emoji to use? Press `Ctrl+Super+F` or choose `Search` from app indicator
and you can search emoji by name, short code or emoticon.

> **Tip:** don't want to use mouse after searching? Press up/down arrows and `Enter` to type

Got emoji you use frequently? Memorize short code (you can see it when hovering emoji
in the palette) and then just type it and watch it be replaced by the emoji.

> **Tip:** you can disable this feature in `Preferences`. It doesn't play well with Firefox

And of course there's eye-candy. Choose emoji set you prefer or app and panel themes to match your system.

## emoji-keyboard won't start!

First try running it in the terminal.

You'll probably see something about `sandbox helper` and `permissions`. That's a known [electron bug](https://github.com/electron/electron/issues/17972).

To work around it simply append `--no-sandbox` flag when starting emoji-keyboard such as

```sh
./emoji-keyboard --no-sandbox
```

Do not worry, as emoji-keyboard doesn't load any remote resources, sandbox can be safely disabled.

Relevant bug [here](https://github.com/OzymandiasTheGreat/emoji-keyboard/issues/55).

## Credits and License

`emoji-keyboard` is release under GPLv3 or later license.

&copy; 2020 [Ozymandias (Tomas Ravinskas)](mailto:tomas.rav@gmail.com)

Based on the Angular-Electron template by [Maxime Gris](https://github.com/maximegris/angular-electron).

Emoji artwork and metadata provided by:

[Blobmoji](https://github.com/c1710/blobmoji) by Google Inc. and is licensed under [Apache-2.0](https://github.com/C1710/blobmoji/blob/master/LICENSE)

[Emoji Two](https://emojitwo.github.io/) by [Ranks.com](http://www.ranks.com/) and is licensed under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/legalcode).

[Noto emoji](https://github.com/googlefonts/noto-emoji) by Google Inc. and is licensed under [Apache-2.0](https://github.com/googlefonts/noto-emoji/blob/master/LICENSE)

[Twemoji](https://github.com/twitter/twemoji) by [Twitter](https://twemoji.twitter.com/) and is licensed under [CC-BY-4.0](https://github.com/twitter/twemoji/blob/master/LICENSE-GRAPHICS)

[Openmoji](https://github.com/hfg-gmuend/openmoji) by [openmoji.org](https://openmoji.org/about/#team) and is licensed under [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/)

## Installation

Grab AppImage from [releases page](https://github.com/OzymandiasTheGreat/emoji-keyboard/releases) and just run it!

***Feedback is always WELCOME***

## Building

You'll need Python 3.6, Poetry, Node 12 and latest NPM.

I use [Poetry](https://python-poetry.org/) to manage Python bits, so you'll need it installed to build/run from source.

First setup environment and install dependencies:

```shell
python3 -m venv .venv
source .venv/bin/activate
poetry install
npm install
```

Then to run from source simply run:

```shell
npm start
```

To build AppImage:

```shell
npm run electron:linux
```

AppImage will be located under `dist/release`.
