#!/usr/bin/env python3

import os
import shutil
import json
from collections import OrderedDict, deque

emoji_modifier_base = {
	'1f590', '1f468', '1f46e', '1f595', '1f3c3', '1f935', '1f646', '1f449',
	'1f477', '1f91c', '1f486', '1f6b6', '1f919', '1f930', '1f44b', '1f933',
	'1f6b5', '270b', '1f483', '1f64b', '1f470', '270a', '1f443', '1f918',
	'1f448', '1f471', '1f474', '1f467', '26f9', '1f44f', '1f93e', '1f6cc',
	'1f481', '1f485', '1f4aa', '1f596', '1f47c', '1f487', '1f44c', '1f476',
	'261d', '1f934', '1f385', '270c', '1f3c4', '1f64f', '1f645', '1f91e',
	'1f926', '270d', '1f647', '1f3c2', '1f6a3', '1f574', '1f3cc', '1f44a',
	'1f57a', '1f3ca', '1f450', '1f442', '1f91a', '1f93d', '1f472', '1f64d',
	'1f482', '1f3c7', '1f64c', '1f6b4', '1f938', '1f3cb', '1f936', '1f44d',
	'1f469', '1f937', '1f64e', '1f91b', '1f478', '1f447', '1f466', '1f44e',
	'1f575', '1f446', '1f6c0', '1f473', '1f939', '1f475'}

emoji_modifiers = {None, '1f3fb', '1f3fc', '1f3fd', '1f3fe', '1f3ff'}

categories = OrderedDict((
	('recent', 'recent'), ('people', 'people'), ('activity', 'activity'),
	('food', 'foods'), ('nature', 'nature'), ('objects', 'objects'),
	('travel', 'travel'), ('flags', 'flags'), ('symbols', 'symbols')))

data_dir = os.path.join(os.path.dirname(__file__), 'data')

icon = 'face-smile'

settings = {'tone': None,
			'autostart': True}

# Get rid of recent-emoji.json used by older versions
try:
	os.remove(os.path.expanduser('~/.local/share/recent-emoji.json'))
except FileNotFoundError:
	pass


class Manager(object):

	def __init__(self):

		self.data_file = os.path.expanduser('~/.local/share/emoji_data.json')
		self.launcher = os.path.expanduser(
			'~/.local/share/emoji-keyboard.desktop')
		self.startup = os.path.expanduser(
			'~/.config/autostart/emoji-keyboard.desktop')

		self.read_settings()
		settings['autostart'] = self.check_autostart()

	def read_settings(self):

		global settings, recent
		try:
			with open(self.data_file) as file_data:
				settings, recent = json.loads(file_data.read())
				recent = deque(recent, maxlen=48)
		except (FileNotFoundError, json.decoder.JSONDecodeError):
			recent = deque(maxlen=48)
			self.save_data()

	def save_data(self):

		with open(self.data_file, 'w') as file_data:
			file_data.write(json.dumps((settings, list(recent))))

	def check_autostart(self):

		return os.path.isfile(self.startup)

	def autostart(self, on):

		if on:
			if not os.path.isfile(self.startup):
				shutil.copy2(self.launcher, self.startup)
		else:
			try:
				os.remove(self.startup)
			except FileNotFoundError:
				pass
