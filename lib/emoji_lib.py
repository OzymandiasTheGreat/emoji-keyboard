#!/usr/bin/env python3

import os
import argparse
import shutil
import sys
import time
import json
from threading import Thread
from multiprocessing.connection import Client, Listener
import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, Gdk, GLib
from Xlib import X, XK, display
from Xlib.protocol import event
try:
	from emoji_keyboard import emoji_shared as shared
except ImportError:
	from . import emoji_shared as shared


class Lock(object):

	def __init__(self):

		lock_name = 'emoji-keyboard.' + os.getenv('USER', 'user') + '.lock'
		self.lock_path = os.path.join(os.getenv('TMPDIR', '/tmp'), lock_name)
		self.locked = self.is_locked()

	def lock(self):

		try:
			with open(self.lock_path, 'x') as fd:
				fd.write(str(os.getpid()))
			self.locked = self.is_locked()
			return True
		except FileExistsError:
			print('Cannot lock process. Lockfile already exists.')
			self.locked = self.is_locked()
			return False

	def is_locked(self):

		try:
			with open(self.lock_path) as fd:
				try:
					os.kill(int(fd.read()), 0)
					return True
				except OSError:
					print('Lockfile found but the process is not running.')
					try:
						os.remove(self.lock_path)
						print('Lockfile removed')
					except PermissionError:
						print('Permission denied. Please remove manually:\n',
							self.lock_path)
					return False
		except FileNotFoundError:
			return False

	def unlock(self):

		try:
			os.remove(self.lock_path)
			return True
		except PermissionError:
			print('Cannot remove lockfile. Permissions changed.')
			return False
		except FileNotFoundError:
			return True


class Command(object):

	def __init__(self):

		parser = self.get_parser()
		self.args = parser.parse_args()

		if shared.lock.locked:
			if self.args.quit:
				shared.connection.send(self.args.quit)
				sys.exit(0)
			elif self.args.actions:
				for action in self.args.actions:
					shared.connection.send(action)
				sys.exit(0)
			else:
				shared.connection.send('show_keyboard')
				sys.exit(0)
		else:
			if self.args.quit:
				sys.exit(0)
			elif self.args.actions:
				Thread(target=self.runner).start()

	def get_parser(self):

		parser = argparse.ArgumentParser(
			description='Virtual keyboard-like emoji picker.\n\n'
				+ 'Running emoji-keyboard without arguments starts indicator\n'
				+ 'or toggles the visibility of keyboard window if indicator\n'
				+ 'is already running.')
		parser.add_argument(
			'-k', '--toggle-keyboard',
			help='toggle the visibility of keyboard window',
			dest='actions',
			action='append_const',
			const='show_keyboard')
		parser.add_argument(
			'-s', '--toggle-search',
			help='toggle the visibility of search window',
			dest='actions',
			action='append_const',
			const='search')
		parser.add_argument(
			'-p', '--preferences',
			help='open preferences',
			dest='actions',
			action='append_const',
			const='settings')
		parser.add_argument(
			'-q', '--quit',
			help='send exit signal to the indicator',
			dest='quit',
			action='store_const',
			const='menu_quit',
			default=None)
		return parser

	def runner(self):

		while 'indicator' not in dir(shared):
			time.sleep(0.1)
		for action in self.args.actions:
			GLib.idle_add(getattr(shared.indicator, action).activate)


class Connection(Thread):

	def __init__(self):

		Thread.__init__(self)
		self.name = 'Listener'
		self.address = ('127.0.0.1', 6000)
		self.auth = b'emoji-keyboard'

	def run(self):

		listener = Listener(self.address, authkey=self.auth)
		while True:
			with listener.accept() as connection:
				msg = connection.recv()
				if msg == 'exit':
					break
				else:
					GLib.idle_add(getattr(shared.indicator, msg).activate)
		listener.close()

	def send(self, msg):

		try:
			connection = Client(self.address, authkey=self.auth)
			connection.send(msg)
			connection.close()
		except ConnectionRefusedError:
			print('Connection Refused')


class Clipboard(object):

	def __init__(self):

		self.local_display = display.Display()
		self.root_window = self.local_display.screen().root
		self.clipboard = Gtk.Clipboard.get(Gdk.SELECTION_CLIPBOARD)
		self.paste_key = (
			self.local_display.keysym_to_keycode(XK.XK_v), X.ControlMask)

	def paste(self, string):

		clipboard_contents = self.clipboard.wait_for_text()
		clipboard_contents = (clipboard_contents if clipboard_contents else '')
		self.clipboard.set_text(string, -1)
		self.clipboard.store()
		time.sleep(1)

		window = self.local_display.get_input_focus().focus
		window.grab_keyboard(
			False, X.GrabModeAsync, X.GrabModeAsync, X.CurrentTime)
		self.local_display.flush()
		key_press = event.KeyPress(detail=self.paste_key[0],
									time=X.CurrentTime,
									root=self.root_window,
									window=window,
									child=X.NONE,
									root_x=0,
									root_y=0,
									event_x=0,
									event_y=0,
									state=self.paste_key[1],
									same_screen=1)
		key_release = event.KeyRelease(detail=self.paste_key[0],
										time=X.CurrentTime,
										root=self.root_window,
										window=window,
										child=X.NONE,
										root_x=0,
										root_y=0,
										event_x=0,
										event_y=0,
										state=self.paste_key[1],
										same_screen=1)
		window.send_event(key_press)
		window.send_event(key_release)
		self.local_display.ungrab_keyboard(X.CurrentTime)
		self.local_display.flush()

		time.sleep(1)
		self.clipboard.set_text(clipboard_contents, -1)
		self.clipboard.store()


class Manager(object):

	def __init__(self):

		self.launcher = os.path.join(shared.data_dir, 'emoji-keyboard.desktop')
		self.starter = os.path.expanduser(
			'~/.config/autostart/emoji-keyboard.desktop')

	def save_settings(self):

		with open(shared.settings_file, 'w') as fd:
			fd.write(json.dumps(shared.settings, indent='\t'))

	def save_recent(self):

		with open(shared.recent_file, 'w') as fd:
			fd.write(json.dumps(list(shared.recent), indent='\t'))

	def check_autostart(self):

		return os.path.isfile(self.starter)

	def set_autostart(self, on):

		if on:
			if not self.check_autostart():
				shutil.copy2(self.launcher, self.starter)
		else:
			try:
				os.remove(self.starter)
			except FileNotFoundError:
				pass

	def exit(self, SIG=None, frame=None):

		shared.main_loop.quit()
		shared.connection.send('exit')
		self.save_recent()
		shared.lock.unlock()
		sys.exit(0)
