#!/usr/bin/env python3
import json
from pathlib import Path
from shutil import copy2 as copy
from pycountry import countries, subdivisions


emojis = {}
categories = [
	{
		'name': 'Recent',
		'categories': [],
		'icon': 'recent.svg',
	},
	{
		'name': 'People',
		'categories': [
			'Smileys & Emotion',
			'People & Body',
		],
		'icon': 'people.svg',
	},
	{
		'name': 'Nature',
		'categories': [
			'Animals & Nature',
		],
		'icon': 'nature.svg',
	},
	{
		'name': 'Food',
		'categories': [
			'Food & Drink',
		],
		'icon': 'foods.svg',
	},
	{
		'name': 'Travel',
		'categories': [
			'Travel & Places',
		],
		'icon': 'travel.svg',
	},
	{
		'name': 'Activities',
		'categories': [
			'Activities',
		],
		'icon': 'activity.svg',
	},
	{
		'name': 'Objects',
		'categories': [
			'Objects',
		],
		'icon': 'objects.svg',
	},
	{
		'name': 'Symbols',
		'categories': [
			'Symbols',
		],
		'icon': 'symbols.svg',
	},
	{
		'name': 'Flags',
		'categories': [
			'Flags',
		],
		'icon': 'flags.svg',
	},
]
skinTones = [
	'',
	'1F3FB',
	'1F3FC',
	'1F3FD',
	'1F3FE',
	'1F3FF',
]


SOURCE = Path.cwd() / 'sources'
ASSETS = Path.cwd() / 'src/assets/'
DATA = ASSETS / 'data'
EMOJI = ASSETS / 'emoji'


RAW_DATA = json.loads((SOURCE / 'emoji-data/emoji.json').read_text())
for rawEmoji in RAW_DATA:
	codePoints = list(int(c, 16) for c in rawEmoji['unified'].split('-'))
	emoji = {
		'name': rawEmoji['name'],
		'codePoints': codePoints,
		'imagePath': '{filepath}.svg'.format(filepath=rawEmoji['unified']),
		'char': ''.join(chr(c) for c in codePoints),
		'shortText': rawEmoji['text'] if rawEmoji['text'] else '',
		'shortName': ':{short_name}:'.format(short_name=rawEmoji['short_name']),
	}
	if rawEmoji['category'] in emojis:
		emojis[rawEmoji['category']].append(emoji)
	else:
		emojis[rawEmoji['category']] = [emoji]
emojis_categorized = {}
for category in categories:
	content = []
	for cat in category['categories']:
		content += emojis[cat]
	emojis_categorized[category['name']] = content
FLAGS = {}
for item in RAW_DATA:
	if item['category'] == 'Flags':
		FLAGS[item['name']] = item['unified']


DATA.mkdir(parents=True, exist_ok=True)
EMOJI.mkdir(parents=True, exist_ok=True)


# copy(SOURCE / 'emoji-data/emoji_pretty.json', DATA / 'emoji.json')
(DATA / 'emoji.json').write_text(json.dumps(emojis_categorized))
# copy(SOURCE / 'emoji-data/categories.json', DATA)
(DATA / 'categories.json').write_text(json.dumps(categories))
(DATA / 'skin-tones.json').write_text(json.dumps(skinTones))


BLOBMOJI = EMOJI / 'blobmoji'
BLOBMOJI_SRC = SOURCE / 'blobmoji/svg'
BLOBMOJI_FLAGS = SOURCE / 'blobmoji/third_party/region-flags/svg'
BLOBMOJI.mkdir(parents=True, exist_ok=True)
for emoji in BLOBMOJI_SRC.iterdir():
	copy(
		emoji,
		str(BLOBMOJI / emoji.stem.replace('emoji_u', '').replace('_', '-').upper()) + '.svg')  # noqa
for flag in BLOBMOJI_FLAGS.iterdir():
	country = flag.stem
	try:
		country_name = (
			countries.get(alpha_2=country).name
				if '-' not in country
					else subdivisions.get(code=country).name
		)
		if f'{country_name} Flag' in FLAGS:
			copy(flag, str(BLOBMOJI / FLAGS[f'{country_name} Flag']) + '.svg')
	except AttributeError:
		pass


EMOJITWO = EMOJI / 'emojitwo'
EMOJITWO_SRC = SOURCE / 'emojitwo/svg'
EMOJICAT = EMOJI / 'categories'
EMOJICAT_SRC = SOURCE / 'emojitwo/other/category_icons'
EMOJITWO.mkdir(parents=True, exist_ok=True)
EMOJICAT.mkdir(parents=True, exist_ok=True)
for emoji in EMOJITWO_SRC.iterdir():
	copy(emoji, str(EMOJITWO / emoji.stem.upper()) + '.svg')
for category in EMOJICAT_SRC.iterdir():
	copy(category, EMOJICAT / category.name)


NOTO_EMOJI = EMOJI / 'noto-emoji'
NOTO_EMOJI_SRC = SOURCE / 'noto-emoji/svg'
NOTO_EMOJI.mkdir(parents=True, exist_ok=True)
for emoji in NOTO_EMOJI_SRC.iterdir():
	copy(emoji, str(NOTO_EMOJI / emoji.stem.replace('emoji_u', '').upper()) + '.svg')  # noqa


OPENMOJI = EMOJI / 'openmoji'
OPENMOJI_SRC = SOURCE / 'openmoji/color/svg'
OPENMOJI.mkdir(parents=True, exist_ok=True)
for emoji in OPENMOJI_SRC.iterdir():
	copy(emoji, str(OPENMOJI / emoji.stem.upper()) + '.svg')


TWEMOJI = EMOJI / 'twemoji'
TWEMOJI_SRC = SOURCE / 'twemoji/assets/svg'
TWEMOJI.mkdir(parents=True, exist_ok=True)
for emoji in TWEMOJI_SRC.iterdir():
	copy(emoji, str(TWEMOJI / emoji.stem.upper()) + '.svg')
