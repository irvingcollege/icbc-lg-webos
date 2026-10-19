#!/usr/bin/env python3
"""Verify the official CLI package structure and deployed application bytes."""
import io
import json
from pathlib import Path, PurePosixPath
import sys
import tarfile

root = Path(__file__).resolve().parent.parent
info = json.loads((root / 'appinfo.json').read_text())
package = Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'artifacts' / f"{info['id']}_{info['version']}_all.ipk"
data = package.read_bytes()
assert data.startswith(b'!<arch>\n'), 'Not an ar-format IPK'
parts = {}
offset = 8
while offset < len(data):
    header = data[offset:offset + 60]
    assert len(header) == 60 and header[58:] == b'`\n'
    size = int(header[48:58])
    name = header[:16].decode().strip().rstrip('/')
    assert name not in parts
    parts[name] = data[offset + 60:offset + 60 + size]
    offset += 60 + size + (size % 2)
assert set(parts) == {'debian-binary', 'control.tar.gz', 'data.tar.gz'}
assert parts['debian-binary'] == b'2.0\n'
with tarfile.open(fileobj=io.BytesIO(parts['control.tar.gz'])) as tar:
    control = tar.extractfile('control').read().decode()
    assert f"Package: {info['id']}\n" in control
    assert f"Version: {info['version']}\n" in control
prefix = f"usr/palm/applications/{info['id']}/"
packaged = {}
with tarfile.open(fileobj=io.BytesIO(parts['data.tar.gz'])) as tar:
    for member in tar.getmembers():
        assert not member.issym() and not member.islnk()
        assert not member.name.startswith('/') and '..' not in PurePosixPath(member.name).parts
        if member.isfile():
            if member.name.startswith(prefix):
                packaged[member.name[len(prefix):]] = tar.extractfile(member).read()
            else:
                assert member.name == f"usr/palm/packages/{info['id']}/packageinfo.json"
expected = {p.relative_to(root / 'dist').as_posix(): p.read_bytes() for p in (root / 'dist').rglob('*') if p.is_file()}
assert packaged == expected, 'Packaged application differs from validated dist/'
print(f'IPK verified: ar/control metadata and {len(packaged)} application files match dist/ byte-for-byte')
