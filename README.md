# Emoji keyboard

## Story Time

> TL,DR I can no longer maintain this app. I'm releasing an updated version that will continue
> working for a while, but it'd be nice if someone took up maintenance.

Hello, there! I'm Tomas and I wrote emoji-keyboard years ago. I was annoyed how using emoji on Linux
involved a lot of copy-pasting. Not that I was a heavy emoji user, mind you. However, as emoji became
more and more mainstream, not using them at all was becoming impossible. So I begrudgingly wrote a little
Python/GTK app in an afternoon and released it in case somebody else had similar feelings on the matter.

It was always an afterthought to maintain this app, and GTK soon proved to be too much of a PITA.
So I rewrote it in Angular/Electron with a Python sidecar for system interface. That limited the
adoption of the app as many folk have irrational hate for all things Electron.

Also, since Linux at the time had no support for color emoji, I included several graphical emoji
sets to give an idea of how others are going to see what you type. That had the downside of making
binaries *very* large. Angular, which I picked without much forethought turned out to be a PITA
as well, so I neglected the app for a long while. It worked fine for me, but GitHub collected a bit
of a backlog of issues.

So last spring (2022) I decided to rethink and rewrite the app, so it wouldn't need much
maintenance and to address at least some of the outstanding issues.

I decided to switch out Electron for Tauri, Angular for React (Native/Expo), and to drop sidecar completely.
Since most (all?) Linux distros now natively support color emoji and even allow switching system emoji font,
there were no longer any need to include graphics. All of the above resulted in much smaller bundle, lower
resource usage, and more responsive app. I can also fix bugs in React, without developing a massive headache
Angular used to give me. Tauri allowed to replace a massive sidecar and complex Electron main script with
third party native dependencies and just a couple lines of Rust. Third party means I don't have to maintain
them!

All good, right? Unfortunately real life got very hectic around the same time and I forgot to actually release
this version, I didn't even push it to GitHub. Now things have settled down, but I no longer use Linux for work
reasons. So I'm releasing the much improved and simplified new version and calling for someone to take up
maintenance! I can walk you through the code any weekend that would suit you and give you write access to the repo.
If you're interested, contact me here, by email, or any way you deem suitable.

It took a bit of work to make sure this compiles and runs after system updates, but if you use Ubuntu, this
should continue working at least until next LTS.

## Usage

Since the version of Tauri I used had issues with global shortcuts, I decided to return to the old mechanic
of manually assigning shortcut in your desktop environment's settings.

Launching the app brings up the palette, closing the window puts it in the tray. Launching the app again
simply brings up the window of a running instance. First launch may be a little slow, but as it stays in
memory afterwards, subsequent launches will be instant.

The interface should be pretty intuitive, up/down arrows to select emoji, typing to search. Right/left arrows
just move the cursor in the search box, this could be improved. Enter types selected emoji in the focused app.
Or just use the mouse. If you want to browse emoji by category, you'll have to use the mouse, didn't have the
time to implement Ctrl-Tab.

There are also some settings. You can enable shortcode overlay over selected emoji, if you also enable expansion,
typing the shortcode will instantly replace it with that emoji.

## License

I'm releasing the new version under MIT. I've come to dislike GPL and I want to give as much freedom to
users and hackers as possible. Hack away!
