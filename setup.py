#!/usr/bin/env python3

import os
from setuptools import setup

src_dir = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(src_dir, 'README.md')) as readme:
	long_description = readme.read()

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

data_files = [
	('share/applications', [
		'emoji-keyboard.desktop'])
	('/etc/xdg/autostart', [
		'emoji-keyboard.desktop'])]

setup(
	name='Emoji Keyboard',
	version='1.0.0',
	description='Virtual keyboard-like emoji picker',
	long_description=long_description,
	url='https://github.com/OzymandiasTheGreat/emoji-keyboard',
	author='Tomas Ravinskas',
	author_email='tomas.rav@gmail.com',
	license='GPLv3+',
	classifiers=classifiers,
	package_dir={'emoji_keyboard': 'lib'},
	packages=['emoji_keyboard'],
	package_data={'emoji_keyboard': ['lib/data/*']},
	data_files=data_files,
	scripts=['emoji-keyboard'],
	# Causes unsatisfiable dependencies in the deb
	# install_requires=['python3-xlib'],
)

