#!/usr/bin/env python3
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
)
