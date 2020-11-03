from macpy import Keyboard
try:
	from emoji_keyboard.server import Server
	from emoji_keyboard.output import Output
	from emoji_keyboard.service import Service
except ImportError:
	from src_py.server import Server
	from src_py.output import Output
	from src_py.service import Service


keyboard = Keyboard()
output = Output(keyboard)
service = Service(keyboard, output)


def exit(payload, meta):
	service.quit()
	keyboard.close()
	Server.quit()


def main():
	Server.listen('type', output.send)
	Server.listen('load', service.register_emoji)
	Server.listen('skin_tone', service.set_skin_tone)
	Server.listen('unload', service.unregister_emoji)
	Server.listen('exit', exit)
	service.start()
	Server.start()


if __name__ == "__main__":
	main()
