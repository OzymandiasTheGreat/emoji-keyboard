import time
from klembord import Selection
from macpy import Key, KeyState
from .server import Server


Locks = {
	'NUMLOCK': False,
	'CAPSLOCK': False,
	'SCROLLLOCK': False,
}
Modifiers = {
	'SHIFT': False,
	'ALTGR': False,
	'CTRL': False,
	'ALT': False,
	'META': False,
}


class Output(object):
	def __init__(self, keyboard):
		self.clipboard = Selection()
		self.keyboard = keyboard

	def paste(self):
		self.keyboard.keypress(Key.KEY_CTRL,  state=KeyState.PRESSED)
		self.keyboard.keypress(Key.KEY_V)
		self.keyboard.keypress(Key.KEY_CTRL, state=KeyState.RELEASED)

	def send(self, string, meta):
		content = self.clipboard.get_with_rich_text()
		time.sleep(0.01)
		self.clipboard.set_text(string)
		time.sleep(0.075)
		self.paste()
		time.sleep(0.15)
		if meta['callback']:
			Server.send('typed', None)
		time.sleep(0.15)
		self.clipboard.set_with_rich_text(*(str(s) for s in content))
		time.sleep(0.05)

	def backspace(self, amount):
		for i in range(amount):
			self.keyboard.keypress(Key.KEY_BACKSPACE)
			time.sleep(0.015)
