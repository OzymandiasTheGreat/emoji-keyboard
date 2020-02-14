# Emoji keyboard

Virtual keyboard-like emoji picker for Linux.

Emoji artwork and metadata provided by [Emoji Two](https://emojitwo.github.io/)
by [Ranks.com](http://www.ranks.com/) and is licensed under
[CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode).

Additional artwork provided by
[Twitter Emoji](https://github.com/twitter/twemoji)
([CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode)) and
[Noto Emoji](https://github.com/googlei18n/noto-emoji)
([Apache 2.0](https://github.com/googlei18n/noto-emoji/blob/master/LICENSE)).

## Installation

You can install emoji keyboard from [pypi](https://pypi.org/project/emoji-keyboard).

First you need pip and pygobject bindings, on Debian based distros you can get them with:

```sudo apt install python3-pip python3-gi gir1.2-gtk-3.0 gir1.2-glib-2.0```

Next run this command (on other distros it may just be `pip` depending on how you installed pip):

```pip3 install --user https://github.com/OzymandiasTheGreat/emoji-keyboard/archive/master.zip```

Now start the indicator by running `emoji-keyboard` and start typing those emoji!

## Usage

### Keyboard

Selecting `Show Keyboard` from the app indicator menu or, if your desktop
environment supports it, middle-clicking app indicator will toggle the visibility
of the keyboard. When the picker is visible simply clicking on emoji will type it
into focused application.

### Search

You can search by official unicode name or by :shortname:.
Pressing `enter` will select and type the first result.

### Hotkeys

<<<<<<< HEAD
If you want to generate Angular components with Angular-cli , you **MUST** install `@angular/cli` in npm global context.
Please follow [Angular-cli documentation](https://github.com/angular/angular-cli) if you had installed a previous version of `angular-cli`.
=======
`emoji-keyboard` can be controlled from the command line. Use your desktop's
native hotkey utility to assign hotkeys to

`emoji-keyboard -k` to toggle visibility of the keyboard,
>>>>>>> -

`emoji-keyboard -s` to toggle visibility of the search window.

Run `emoji-keyboard -h` in the terminal to get full list of commands.
