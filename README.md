# Emoji keyboard

Virtual keyboard-like emoji picker for linux.

This project uses artwork and data from the excellent
[EmojiOne project](http://emojione.com/).

## Installation

### Dependencies

You'll need Python 3 GObject bindings and python3-xlib package.
If you're on a debian based distro you can install them with

`sudo apt install python3-gi gir1.2-gtk-3.0 gir1.2-glib-2.0
gir1.2-appindicator3-0.1 python3-xlib`

### App

There are several ways to install the app, you can install from deb you can
find on
[releases page](https://github.com/OzymandiasTheGreat/emoji-keyboard/releases).

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

You can search by oficial unicode name or by :shortname:.
Pressing `enter` will select and type the first result.

### Hotkeys

`emoji-keyboard` can be controlled from the command line. Use your desktop's
native hotkey utility to assign hotkeys to

`emoji-keyboard -k` to toggle visibility of the keyboard,

`emoji-keyboard -s` to toggle visibility of the search window.

Run `emoji-keyboard -h` in the terminal to get full list of commands.
