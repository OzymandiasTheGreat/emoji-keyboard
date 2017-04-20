#!/usr/bin/env python3

import os
from setuptools import setup

src_dir = os.path.dirname(__file__)
with open(os.path.join(src_dir, 'README.md')) as fd:
	long_description = fd.read()

classifiers = [
	'Development Status :: 5 - Production/Stable',
	'Environment :: X11 Applications',
	'Environment :: X11 Applications :: GTK',
	'Intended Audience :: End Users/Desktop',
	'License :: OSI Approved :: GNU General Public License v3 or later (GPLv3+)',
	'Operating System :: POSIX :: Linux',
	'Programming Language :: Python :: 3',
	'Programming Language :: Python :: 3 :: Only',
	'Topic :: Utilities']

data_files = [('share/applications', ['lib/data/emoji-keyboard.desktop'])]

if os.geteuid() == 0:
	data_files.append(
		('/etc/xdg/autostart', ['lib/data/emoji-keyboard.desktop']))

setup(
	name='emoji-keyboard',
	version='2.0.0',
	description='Virtual keyboard-like emoji picker',
	long_description=long_description,
	url='https://github.com/OzymandiasTheGreat/emoji-keyboard',
	author='Tomas Ravinskas',
	author_email='tomas.rav@gmail.com',
	license='GPLv3+',
	classifiers=classifiers,
	package_dir={'emoji_keyboard': 'lib'},
	packages=['emoji_keyboard'],
	package_data={'emoji_keyboard': [
		'data/*.json',
		'data/svg/*.svg',
		'data/category_icons/*.svg',
		'data/emoji-keyboard.desktop']},
	data_files=data_files,
	scripts=['emoji-keyboard'],
	install_requires=['python3-xlib']
)
