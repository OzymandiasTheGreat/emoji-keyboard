#!/usr/bin/env python3

import os
import sys
import json
import collections
import time
from gi.repository import Gtk, GLib, Gdk, GdkPixbuf
from Xlib import X, XK, display
from Xlib.protocol import event

data_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'data')
recent_file = os.path.expanduser('~/.local/share/recent-emoji.json')

with open(os.path.join(data_dir, 'emoji.json')) as emoji_json:
	emojis = json.loads(
		emoji_json.read(), object_pairs_hook=collections.OrderedDict)

categories = (
	'recent', 'people', 'activity', 'food', 'nature', 'objects', 'travel',
	'flags', 'symbols')

try:
	with open(recent_file) as rf:
		recent = collections.deque(json.loads(rf.read()), maxlen=48)
except FileNotFoundError:
	recent = collections.deque(maxlen=48)

clipboard = Gtk.Clipboard.get(Gdk.SELECTION_CLIPBOARD)
clipboard_backup = ''

local_display = display.Display()
root_window = local_display.screen().root
paste_key = (
	local_display.keysym_to_keycode(XK.XK_v), Gdk.ModifierType.CONTROL_MASK)

def save_recent():

	with open(recent_file, 'w') as rf:
		rf.write(json.dumps(list(recent)))

def backup_clipboard():

	backup = clipboard.wait_for_text()
	if backup is None:
		backup = ''
	return backup

def restore_clipboard():

	clipboard.set_text(clipboard_backup, -1)
	clipboard.store()
	return False

def paste(char):

	global clipboard_backup
	clipboard_backup = backup_clipboard()
	clipboard.set_text(char, -1)

	window = local_display.get_input_focus().focus

	window.grab_keyboard(True, X.GrabModeAsync, X.GrabModeAsync, X.CurrentTime)
	local_display.flush()

	key_press = event.KeyPress(detail=paste_key[0],
									time=X.CurrentTime,
									root=root_window,
									window=window,
									child=X.NONE,
									root_x=0,
									root_y=0,
									event_x=0,
									event_y=0,
									state=paste_key[1],
									same_screen=1)
	key_release = event.KeyRelease(detail=paste_key[0],
									time=X.CurrentTime,
									root=root_window,
									window=window,
									child=X.NONE,
									root_x=0,
									root_y=0,
									event_x=0,
									event_y=0,
									state=paste_key[1],
									same_screen=1)
	window.send_event(key_press)
	window.send_event(key_release)

	local_display.ungrab_keyboard(X.CurrentTime)
	local_display.flush()

	GLib.timeout_add(200, restore_clipboard)


class Picker(Gtk.Window):

	def __init__(self):

		Gtk.Window.__init__(
			self, title="Emoji", accept_focus=False, skip_taskbar_hint=True)
		self.set_keep_above(True)
		self.position = None
		self.visible = False
		geometry = Gdk.Geometry()
		geometry.min_height = 200
		geometry.min_width = 500
		self.set_geometry_hints(None, geometry, Gdk.WindowHints.MIN_SIZE)
		self.set_resizable(False)
		#~ self.set_default_size(500, 200)
		self.connect('show', self.show_window)
		self.connect('delete-event', self.hide_window)

		notebook = Gtk.Notebook()
		self.add(notebook)

		scrolled_window = Gtk.ScrolledWindow()
		scrolled_window.set_policy(
			Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC)

		for category in categories:
			scrolled_window = Gtk.ScrolledWindow()
			scrolled_window.set_policy(
				Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC)

			model = Gtk.ListStore(GdkPixbuf.Pixbuf, str, str)
			setattr(self, category, Gtk.IconView.new_with_model(model))
			page = getattr(self, category)
			page.set_selection_mode(Gtk.SelectionMode.NONE)
			page.set_activate_on_single_click(True)
			page.connect('item-activated', self.send_emoji)
			page.set_pixbuf_column(0)
			page.set_tooltip_column(1)
			page.set_columns(12)
			scrolled_window.add(page)
			label = Gtk.Box(spacing=2)
			image = Gtk.Image.new_from_file(os.path.join(
				data_dir, 'category_icons', category + '.png'))
			text = Gtk.Label(category.title())
			label.pack_start(image, True, True, 0)
			label.pack_start(text, True, True, 0)
			image.show()
			text.show()
			notebook.append_page(scrolled_window, label)

		for emoji in emojis:
			name = emojis[emoji]['name']
			category = emojis[emoji]['category']
			codepoint = emojis[emoji]['unicode']
			try:
				iconview = getattr(self, category)
				model = iconview.get_model()
				pixbuf = GdkPixbuf.Pixbuf.new_from_file(os.path.join(
					data_dir, 'png', codepoint + '.png'))
				model.append([pixbuf, name, emoji])
			except AttributeError:
				pass

		self.build_recent()

	def build_recent(self):

		iconview = getattr(self, 'recent')
		model = iconview.get_model()
		model.clear()
		for emoji in recent:
			name = emojis[emoji]['name']
			codepoint = emojis[emoji]['unicode']
			pixbuf = GdkPixbuf.Pixbuf.new_from_file(os.path.join(
				data_dir, 'png', codepoint + '.png'))
			model.append([pixbuf, name, emoji])

	def show_window(self, window):

		if self.position:
			self.move(*self.position)
		self.visible = True

	def hide_window(self, window, event):

		self.position = self.get_position()
		self.hide_on_delete()
		self.visible = False
		return True

	def send_emoji(self, widget, path):

		global recent
		model = widget.get_model()
		key = model[path][2]
		if key in recent:
			recent.remove(key)
		recent.appendleft(key)
		self.build_recent()
		codepoint = emojis[key]['unicode']
		if '-' in codepoint:
			split = codepoint.split('-')
			paste(chr(int(split[0], 16)) + chr(int(split[1], 16)))
		else:
			paste(chr(int(codepoint, 16)))
