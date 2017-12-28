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

### Dependencies

**Dependency change: python3-xlib has been dropped in favor of python3-evdev**

You'll need Python 3.5+ and GObject bindings, as well as python3-evdev package.
If you're on a Debian based distro you can install them with

`sudo apt install python3 python3-gi gir1.2-gtk-3.0 gir1.2-glib-2.0
python3-evdev`

Optionally, if you want indicator in the panel:

`sudo apt install gir1.2-appindicator3-0.1`

If you're still on X, **DO** install python3-xlib. This will perform better and won't require modifications to the system.
Prefer pip version if possible, because the one in debian archives is ancient.

`pip3 install python-xlib`

**IF YOU'RE ON WAYLAND**
You'll need to:
- Create `uinput` group `sudo addgroup uinput`
- Add yourself to this group `sudo adduser $(whoami) uinput`
- Create udev rule. In the terminal type this:
	- `sudo nano /etc/udev/rules.d/uinput.rules`
	- `KERNEL=="uinput", GROUP="uinput", MODE="0660"`
	- To save press `Ctrl+o` `Enter` `Ctrl+x`

This will allow your user to create virtual devices for pasting emoji, without these steps Type mode WILL NOT WORK.


### App

There are several ways to install the app, ~~you can install from deb you can
find on
[releases page](https://github.com/OzymandiasTheGreat/emoji-keyboard/releases)~~.

You can install with pip

`sudo pip3 install
https://github.com/OzymandiasTheGreat/emoji-keyboard/archive/master.zip`

There's also ppa, courtesy of [atareao](https://github.com/atareao)
Note that this ppa is NOT maintained by me, so I can't guarantee latest versions.

`sudo add-apt-repository ppa:atareao/atareao`

`sudo apt update`

`sudo apt install emoji-keyboard`

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

`emoji-keyboard` can be controlled from the command line. Use your desktop's
native hotkey utility to assign hotkeys to

`emoji-keyboard -k` to toggle visibility of the keyboard,

`emoji-keyboard -s` to toggle visibility of the search window.

Run `emoji-keyboard -h` in the terminal to get full list of commands.
