import io
import json
import struct
import sys
import zlib
from pathlib import Path

from PIL import Image

PREVIEW_SIZE = (600, 300)

RESEARCH_DATA = Path("../src/data/raw/research_data.json")

def read_byte(f, count=1):
    return struct.unpack("B"*count, f.read(count))

def read_short(f):
    return struct.unpack("H", f.read(2))[0]

def do_file(fp, outdir=None):
    if not fp.exists():
        raise FileNotFoundError(fp)
    if not outdir:
        outdir = fp.parent
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
            im.save(outdir / f"{fp.stem}_{image_count}.png", optimize=True)
            if width > height:
                small_size = [PREVIEW_SIZE[0], int(height * PREVIEW_SIZE[0] / width)]
            else:
                small_size = [int(width * PREVIEW_SIZE[1] / height), PREVIEW_SIZE[1]]
            im.resize(small_size).save(outdir / f"{fp.stem}_{image_count}_small.webp", lossless=False, quality=75)
            i = 0
            imdata = []
            image_count += 1
            width = read_short(data)
            height = read_short(data)    
            im = Image.new("RGBA", (width, height))
        imdata.append(read_byte(data, 4))
        i += 1
    im.putdata(imdata)
    im.save(outdir / f"{fp.stem}_{image_count}.png", optimize=True)
    if width > height:
        small_size = [PREVIEW_SIZE[0], int(height * PREVIEW_SIZE[0] / width)]
    else:
        small_size = [int(width * PREVIEW_SIZE[1] / height), PREVIEW_SIZE[1]]
    im.resize(small_size).save(outdir / f"{fp.stem}_{image_count}_small.webp", lossless=False, quality=75)
    return image_count

def main(args):
    researchdata = {}
    if RESEARCH_DATA.is_file():
        with RESEARCH_DATA.open() as f:
            researchdata = json.load(f)
    outdir = Path("../public/gameassets/research/")
    for i in args:
        fp = Path(i)
        if fp.is_dir():
            # outdir = fp / "out/"
            # outdir.mkdir(exist_ok=True)
            for fp2 in fp.glob("**/*.brs"):
                researchdata[fp2.stem] = do_file(fp2, outdir=outdir) + 1
        else:
            researchdata[fp.stem] = do_file(fp, outdir=outdir) + 1
    with RESEARCH_DATA.open("w+") as f:
        json.dump(researchdata, f)

if __name__ == "__main__":
    main(sys.argv[1:])
