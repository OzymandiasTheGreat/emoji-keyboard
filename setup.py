#!/usr/bin/env python3
<<<<<<< HEAD

import os
from setuptools import setup
from lib.emoji_shared import version

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
	version=version,
	description='Virtual keyboard-like emoji picker',
	long_description=long_description,
	url='https://github.com/OzymandiasTheGreat/emoji-keyboard',
	author='Tomas Ravinskas',
	author_email='tomas.rav@gmail.com',
	license='GPLv3+',
	classifiers=classifiers,
	packages=['emoji_keyboard'],
	package_dir={'emoji_keyboard': 'lib'},
	package_data={'emoji_keyboard': [
		'data/*.json',
		'data/*/*.svg',
		'data/emoji-keyboard.desktop']},
	data_files=data_files,
	scripts=['emoji-keyboard'],
	install_requires=['evdev']
=======
from setuptools import setup


scripts = ['main.py']
packages = ['emoji_keyboard']
package_dir = {'emoji_keyboard': 'src_py'}
install_requires = [
	'klembord>=0.2.1,<0.3.0',
	'macpy>=0.1.2,<0.2.0',
]


setup(
	name = 'emoji-keyboard',
	version = '3.0.0rc0',
	description = 'Type emoji easily! Virtual keyboard-like emoji palette with lots of features.',
	long_description = None,
	author = 'Ozymandias (Tomas Ravinskas)',
	author_email = 'tomas.rav@gmail.com',
	url = 'https://github.com/OzymandiasTheGreat/emoji-keyboard',
	scripts = scripts,
	packages = packages,
	package_dir = package_dir,
	install_requires = install_requires,
	python_requires = '>=3.6,<4.0',
>>>>>>> - Prepared configs for packaging
)
