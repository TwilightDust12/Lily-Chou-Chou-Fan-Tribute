"""Dependency-free checks for static links, assets, and accessible control targets."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import re

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.targets = []
        self.files = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for key in ('aria-controls', 'aria-labelledby'):
            self.targets.extend(attrs.get(key, '').split())
        for key in ('src', 'href'):
            value = attrs.get(key, '')
            if value.startswith('#'):
                self.targets.append(value[1:])
            elif value and not urlsplit(value).scheme:
                assert value.startswith('./'), f'Non-relative asset: {value}'
                self.files.append(value)
        if tag == 'img':
            assert 'alt' in attrs, 'Image needs alt text (empty for decoration)'
        if tag == 'button':
            assert attrs.get('type') == 'button', 'Button needs explicit type'


page = Page()
html = (ROOT / 'index.html').read_text()
page.feed(html)
assert len(page.ids) == len(set(page.ids)), 'Duplicate IDs'
assert set(page.targets) <= set(page.ids), f'Missing target: {set(page.targets) - set(page.ids)}'
for asset in page.files:
    assert (ROOT / urlsplit(asset).path).is_file(), f'Missing file: {asset}'
for name in ('script.js', 'player.js'):
    for target in re.findall(r"getElementById\('([^']+)'\)", (ROOT / name).read_text()):
        assert target in page.ids, f'{name} references missing #{target}'
assert 'portfolio' not in html.lower(), 'Portfolio copy returned'
assert '<form' not in html.lower(), 'Do not introduce an unconnected submission form'
assert '呼吸' in html, 'Album title Kokyuu missing'
assert 'Disclaimer' in html and 'Copyright Notice' in html, 'Legal disclaimer header missing'
assert 'does not own' in html.lower(), 'Non-ownership disclaimer missing'
assert 'Takeshi Kobayashi' in html, 'Composer attribution missing'
assert 'Salyu' in html, 'Vocalist attribution missing'
assert 'Fan-written fragments' in html

album_dir = ROOT / 'assets' / 'Lily Chou-Chou' / '呼吸 (2008)'
assert album_dir.is_dir(), f'Album folder missing: {album_dir}'
mp3_files = list(album_dir.glob('*.mp3'))
assert len(mp3_files) == 9, f'Expected 9 MP3 tracks, found {len(mp3_files)}'

jewel_cases = re.findall(r'data-track-index="(\d+)"', html)
assert len(jewel_cases) == 9, f'Expected 9 jewel case buttons, found {len(jewel_cases)}'

player_js = (ROOT / 'player.js').read_text()
assert '.mp3' in player_js, 'player.js must reference MP3 tracks'

print(f'PASS: {len(page.ids)} unique IDs, {len(page.targets)} linked targets, {len(page.files)} local assets, 9 MP3 tracks, and player bindings')

