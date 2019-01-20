# Emoji keyboard

Virtual keyboard-like emoji picker for Linux.

Artwork and metadata are provided by the following:
- [Ranks.com](http://www.ranks.com/)'s [Emoji Two](https://emojitwo.github.io/), licensed under
[CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode)
- [Twitter](https://twitter.com/)'s [Twemoji](https://github.com/twitter/twemoji), licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode)
- [Google i18n](https://developers.google.com/international)'s [Noto Emoji](https://github.com/googlei18n/noto-emoji), licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).

## Installation

### Dependencies

**Dependency change: python3-xlib has been dropped in favor of python3-evdev**

You'll need Python 3.5+ and GObject bindings, as well as python3-evdev package.
If you're on a Debian based distro you can install them with this command:

    sudo apt install python3 python3-gi gir1.2-gtk-3.0 gir1.2-glib-2.0 python3-evdev

Optionally, if you want an indicator in the panel, execute the following:

    sudo apt install gir1.2-appindicator3-0.1

#### If your DE uses X

Install `python3-xlib`, as it will perform better and won't require any further modifications. Using `pip` is preferred because the version installed by `apt` is outdated.

##### Installing via `pip`

    pip3 install python-xlib

##### Installing via `apt`

    sudo apt install python-xlib

#### If your DE uses WAYLAND

Open the terminal and do the following:
- Create `uinput` group:

      sudo addgroup uinput
- Add yourself to the group:

      sudo adduser $USERNAME uinput
- Open `/etc/udev/rules.d/uinput.rules` as root in preferred text editor
- Add the following text to new line, then save the file:

      KERNEL=="uinput", GROUP="uinput", MODE="0660"

This allows the program to create a virtual device for pasting emojis; without these steps, `Type` mode **will not work**.


### App

##### Installing via `pip`

    sudo -H pip3 install https://github.com/OzymandiasTheGreat/emoji-keyboard/archive/master.zip

##### Installing via `apt` using `ppa` repo courtesy of [atareao](https://github.com/atareao) (latest version not guaranteed)

    sudo add-apt-repository ppa:atareao/atareao
    sudo apt update
    sudo apt install emoji-keyboard

## Usage

### Keyboard

To toggle visibility of the keyboard, select `Show Keyboard` from the app indicator menu, or, if supported by your DE, middle-click the app indicator. When the keyboard is visible, simply click an emoji to type it into the focused application.

### Search

You can search for emojis by entering a word that pertains to the emoji you're looking for. Click on an emoji or use arrow keys and <kbd>ENTER</kbd> to type an emoji into the focused application.

### Hotkeys

If you'd like to assign hotkeys to control the application, use the command `emoji-keyboard -h` to get a list of commands, then use a hotkey utility (most desktop environments have one in their settings application) to assign keybindings to the desired commands.
