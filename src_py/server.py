import sys
import json
from traceback import format_exception


class Server(object):
	listeners = {}

	@classmethod
	def start(cls):
		while True:
			msg = sys.stdin.readline()
			msg = json.loads(msg) if msg else {'action': None}
			if msg['action'] is None:
				break
			else:
				cls.listeners[msg['action']](
					msg['payload'],
					msg['meta'] if 'meta' in msg else {},
				)

	@classmethod
	def listen(cls, action, callback):
		cls.listeners[action] = callback

	@classmethod
	def send(cls, action, payload, meta={}):
		print(json.dumps({'action': action, 'payload': payload, 'meta': meta}))

	@classmethod
	def send_error(cls, error, msg=None):
		print(
			json.dumps({
				'error': repr(error),
				'msg': msg if msg else error.args[0],
				'traceback': format_exception(error.__class__, error, error.__traceback__),
			}),
			file=sys.stderr,
		)

	@classmethod
	def quit(cls):
		cls.send(None, '')
		sys.exit(0)
