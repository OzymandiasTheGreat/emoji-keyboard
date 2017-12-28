#!/usr/bin/env python3

import os
import json
from collections import OrderedDict, deque
from subprocess import run, PIPE
import gi
gi.require_version('Gdk', '3.0')
from gi.repository import Gdk

version = '2.3.0'

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
	'1f575', '1f446', '1f6c0', '1f473', '1f939', '1f475', '1f93c'}

emoji_modifiers = (None, '1f3fb', '1f3fc', '1f3fd', '1f3fe', '1f3ff')

categories = OrderedDict((
	('recent', 'recent'), ('people', 'people'), ('activity', 'activity'),
	('food', 'foods'), ('nature', 'nature'), ('objects', 'objects'),
	('travel', 'travel'), ('flags', 'flags'), ('symbols', 'symbols')))

data_dir = os.path.join(os.path.dirname(__file__), 'data')
recent_file = os.path.expanduser('~/.local/share/recent_emoji.json')
settings_file = os.path.expanduser('~/.config/emoji-keyboard.json')
icon = 'face-smile'

try:
	with open(settings_file) as fd:
		settings = json.loads(fd.read())
		if 'emoji_set' not in settings:
			settings['emoji_set'] = 'emojitwo'
			settings['use_indicator'] = True
			settings['type_on_select'] = True
except (FileNotFoundError, ValueError):
	settings = {'tone': None,
				'emoji_size': 32,
				'keyboard_use_compact': False,
				'keyboard_pos': (0, 0),
				'keyboard_size_full': (820, 300),
				'keyboard_columns_full': 16,
				'keyboard_size_compact': (375, 250),
				'keyboard_columns_compact': 7,
				'search_pos': (0, 0),
				'emoji_set': 'emojitwo',
				'use_indicator': True,
				'type_on_select': True}
	try:
		os.remove(settings_file)
	except FileNotFoundError:
		pass

try:
	with open(recent_file) as fd:
		recent = deque(json.loads(fd.read()), maxlen=48)
except (FileNotFoundError, ValueError):
	recent = deque(maxlen=48)
	try:
		os.remove(recent_file)
	except FileNotFoundError:
		pass

keyboard_visible = False
search_visible = False

def check_wayland():

	sessions = run(
		['loginctl', 'list-sessions'], stdout=PIPE, universal_newlines=True)
	for line in sessions.stdout.split('\n'):
		if os.getenv('USER') in line:
			session = line.split()[0]
	type_ = run(
		['loginctl', 'show-session', session, '-p', 'Type', '--value'],
		stdout=PIPE, universal_newlines=True)
	if type_.stdout == 'x11\n':
		return False
	return True

def get_keycode():

	keymap = Gdk.Keymap.get_default()
	key_list = keymap.get_entries_for_keyval(Gdk.KEY_v)
	try:
		return key_list[1][1].keycode
	except IndexError:
		return key_list[1][0].keycode

wayland = check_wayland()
keycode = get_keycode()
