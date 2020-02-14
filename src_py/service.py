import json
from pathlib import Path
from threading import Thread
from queue import Queue


class Service(Thread):
	def __init__(self, keyboard, output):
		super().__init__(name="Emoji Service", daemon=True)
		self.keyboard = keyboard
		self.output = output
		self.emoji = {}
		self.skin_tone = 'null'
		self.queue = Queue()

		self.keyboard.install_keyboard_hook(lambda e: None)

	def set_skin_tone(self, skin_tone, meta):
		self.skin_tone = skin_tone or 'null'

	def register_emoji(self, emoji_path, meta):
		emoji_list = json.loads(Path(emoji_path).read_text())
		for category in emoji_list.values():
			for emoji in category:
				short_name = emoji['shortName']
				emoticon = emoji['shortText']
				if short_name:
					hotstring = self.keyboard.register_hotstring(
						short_name, [], self.queue.put_nowait,
					)
					self.emoji[hotstring] = emoji
				if emoticon:
					hotstring = self.keyboard.register_hotstring(
						emoticon, [], self.queue.put_nowait,
					)
					self.emoji[hotstring] = emoji

	def unregister_emoji(self, payload, meta):
		for hotstring in self.emoji.keys():
			self.keyboard.unregister_hotstring(hotstring)

	def run(self):
		while True:
			hotstring = self.queue.get()
			if hotstring is None:
				break
			emoji = self.emoji[hotstring]
			string = ''.join(
				chr(c) for c in emoji['skinTones'][self.skin_tone]['codePoints']
			)
			self.output.backspace(len(hotstring.string))
			self.output.send(string, {'callback': False})

	def quit(self):
		self.queue.put_nowait(None)
		self.keyboard.uninstall_keyboard_hook()
		self.join()
