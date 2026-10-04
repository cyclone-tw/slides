#!/usr/bin/env python3
"""Package authored source and original PNGs as an offline HTML presentation."""
import base64
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
names = ('teacher', 'owl', 'classroom', 'office', 'corridor')
assets = {name: 'data:image/png;base64,' + base64.b64encode((ROOT / 'assets' / (name + '.png')).read_bytes()).decode('ascii') for name in names}
html = (ROOT / 'src/template.html').read_text()
for marker, value in {
    '/*__STYLE__*/': (ROOT / 'src/style.css').read_text(),
    '/*__ASSETS__*/': 'const ASSETS = ' + json.dumps(assets) + ';',
    '/*__CONTENT__*/': (ROOT / 'src/content.js').read_text(),
    '/*__APP__*/': (ROOT / 'src/app.js').read_text(),
}.items():
    assert html.count(marker) == 1, marker
    html = html.replace(marker, value)
(ROOT / 'index.html').write_text(html)
print(f'Built {ROOT / "index.html"} ({len(html.encode()):,} bytes)')
