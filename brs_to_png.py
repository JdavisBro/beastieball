import io
import json
import struct
import sys
import zlib
from pathlib import Path

from PIL import Image

def read_byte(f, count=1):
    return struct.unpack("B"*count, f.read(count))

def read_short(f):
    return struct.unpack("H", f.read(2))[0]

def do_file(fp):
    if not fp.exists():
        raise FileNotFoundError(fp)
    print(fp.stem)
    with fp.open("rb") as f:
        data = zlib.decompress(f.read())
    datalen = len(data)
    data = io.BytesIO(data)
    data.seek(0)
    width = read_short(data)
    height = read_short(data)    
    im = Image.new("RGBA", (width, height))
    i = 0
    image_count = 0
    imdata = []
    while data.tell() != datalen:
        if i >= width*height:
            im.putdata(imdata)
            im.save(fp.parent / f"{fp.stem}_{image_count}.png")
            i = 0
            imdata = []
            image_count += 1
            width = read_short(data)
            height = read_short(data)    
            im = Image.new("RGBA", (width, height))
        imdata.append(read_byte(data, 4))
        i += 1
    im.putdata(imdata)
    im.save(fp.parent / f"{fp.stem}_{image_count}.png")
    return image_count

def main(args):
    researchdata = {}
    for i in args:
        fp = Path(i)
        if fp.is_dir():
            for fp2 in fp.glob("**/*.brs"):
                researchdata[fp2.stem] = do_file(fp2) + 1
        else:
            researchdata[fp.stem] = do_file(fp) + 1
    with open("research_data.json", "w+") as f:
        json.dump(researchdata, f)

if __name__ == "__main__":
    main(sys.argv[1:])
