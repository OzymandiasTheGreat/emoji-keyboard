#!/usr/bin/env python3

from pathlib import Path

emoji_json = Path('emojitwo/emoji.json')
res_emoji_json = Path('data/emoji.json')
cat_icons = Path('emojitwo/other/category_icons')
res_cat_icons = Path('data/category-icons')
emojitwo = Path('emojitwo/svg')
res_emojitwo = Path('data/emojitwo')
twemoji = Path('twemoji/2/svg')
res_twemoji = Path('data/twemoji')
noto_emoji = Path('noto-emoji/svg')
noto_flags = Path('noto-emoji/third_party/region-flags/svg')
res_noto_emoji = Path('data/noto-emoji')
ignore_chars = [
	'200d', # zero-width joiner
	'fe0f', # variant form
]

res_emoji_json.write_bytes(emoji_json.read_bytes())
valid_names = []
for icon in cat_icons.iterdir():
	(res_cat_icons / icon.name).write_bytes(icon.read_bytes())
for icon in emojitwo.iterdir():
	valid_names.append(icon.name)
	(res_emojitwo / icon.name).write_bytes(icon.read_bytes())
for icon in twemoji.iterdir():
	fragments = [
		fragment for fragment in icon.stem.split('-')
			if fragment not in ignore_chars]
	name = '-'.join(fragments) + '.svg'
	if name in valid_names:
		(res_twemoji / name).write_bytes(icon.read_bytes())
for icon in noto_emoji.iterdir():
	fragments = [
		fragment for fragment in icon.stem.strip('emoji_u').split('_')
			if fragment not in ignore_chars]
	name = '-'.join(fragments) + '.svg'
	if name in valid_names:
		(res_noto_emoji / name).write_bytes(icon.read_bytes())
for icon in noto_flags.iterdir():
	codepoints = [hex(0x1F1E6 + ord(char) - ord('A'))[2:] for char in icon.stem]
	name = '-'.join(codepoints) + '.svg'
	if name in valid_names:
		(res_noto_emoji / name).write_bytes(icon.read_bytes())
