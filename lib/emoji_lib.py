#!/usr/bin/env python3

import os
import argparse
import shutil
import sys
import time
import json
from subprocess import run, PIPE, DEVNULL
from threading import Thread
from multiprocessing.connection import Client, Listener
import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, Gdk, GLib
from evdev import UInput, ecodes as e
try:
	from Xlib import X, XK, display, Xatom
	from Xlib.protocol import event
	xlib = True
except ImportError:
	xlib = False
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
		parser.add_argument(
			'-v', '--version',
			help='print version and quit',
			action='version',
			version='%(prog)s ' + shared.version)
		return parser

	def runner(self):

		while 'indicator' not in dir(shared):
			time.sleep(0.1)
		if shared.settings['use_indicator']:
			for action in self.args.actions:
				GLib.idle_add(getattr(shared.indicator, action).activate)
		else:
			for action in self.args.actions:
				GLib.idle_add(getattr(shared.indicator, action))


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
					if shared.settings['use_indicator']:
						GLib.idle_add(getattr(shared.indicator, msg).activate)
					else:
						GLib.idle_add(getattr(shared.indicator, msg))
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

		self.xclip = shutil.which('xclip')
		self.xclip_get = [self.xclip, '-o', '-selection', 'clipboard']
		self.xclip_set = [self.xclip, '-i', '-selection', 'clipboard']
		self.xsel = shutil.which('xsel')
		self.xsel_get = [self.xsel, '--output', '--clipboard']
		self.xsel_set = [self.xsel, '--input', '--clipboard']
		self.gtkclipboard = Gtk.Clipboard.get(Gdk.SELECTION_CLIPBOARD)
		if xlib:
			self.display = display.Display()
			self.root = self.display.screen().root

	def get(self):

		if self.xclip:
			process = run(
				self.xclip_get, stdout=PIPE, stderr=DEVNULL,
				universal_newlines=True)
			return process.stdout
		elif self.xsel:
			process = run(
				self.xsel_get, stdout=PIPE, stderr=DEVNULL,
				universal_newlines=True)
			return process.stdout
		else:
			content = self.gtkclipboard.wait_for_text()
			if content:
				return content
			else:
				return ''

	def set(self, string):

		if self.xclip:
			run(self.xclip_set, input=string, universal_newlines=True)
		elif self.xsel:
			run(self.xsel_set, input=string, universal_newlines=True)
		else:
			self.gtkclipboard.set_text(string, -1)
		return False

	def paste_evdev(self):

		with UInput() as uinput:
			uinput.write(e.EV_KEY, e.KEY_LEFTCTRL, 1)
			uinput.write(e.EV_KEY, shared.keycode - 8, 1)
			uinput.syn()
			uinput.write(e.EV_KEY, shared.keycode - 8, 0)
			uinput.write(e.EV_KEY, e.KEY_LEFTCTRL, 0)
			uinput.syn()

	def paste_xlib(self):

		window = self.display.get_input_focus().focus
		window.grab_keyboard(
			False, X.GrabModeAsync, X.GrabModeAsync, X.CurrentTime)
		self.display.flush()
		key_press = event.KeyPress(detail=shared.keycode,
									time=X.CurrentTime,
									root=self.root,
									window=window,
									child=X.NONE,
									root_x=0,
									root_y=0,
									event_x=0,
									event_y=0,
									state=X.ControlMask,
									same_screen=1)
		key_release = event.KeyRelease(detail=shared.keycode,
										time=X.CurrentTime,
										root=self.root,
										window=window,
										child=X.NONE,
										root_x=0,
										root_y=0,
										event_x=0,
										event_y=0,
										state=X.ControlMask,
										same_screen=1)
		window.send_event(key_press)
		window.send_event(key_release)
		self.display.ungrab_keyboard(X.CurrentTime)
		self.display.flush()

	def paste(self, string):

		backup = self.get()
		self.set(string)

		def paste():

			if shared.settings['type_on_select']:
				if shared.wayland:
					self.paste_evdev()
				else:
					if xlib:
						self.paste_xlib()
					else:
						self.paste_evdev()

				GLib.timeout_add(200, self.set, backup)
			return False

		GLib.timeout_add(50, paste)


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
