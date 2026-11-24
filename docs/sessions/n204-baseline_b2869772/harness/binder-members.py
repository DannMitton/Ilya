# Lists every member of a .ilya binder (a zip): name, size, crc32, sha256, and the zip's own date stamp. usage: python3 -I binder-members.py <file.ilya>
import sys, zipfile, hashlib
z = zipfile.ZipFile(sys.argv[1])
for i in z.infolist():
    d = z.read(i.filename)
    print(f"{hashlib.sha256(d).hexdigest()}  {len(d)}  {i.CRC:08x}  {i.date_time}  {i.filename}")
