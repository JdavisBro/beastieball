import io
import json
import struct
import sys
import zlib
import subprocess
from pathlib import Path

from PIL import Image

PREVIEW_SIZE = (600, 300)

RESEARCH_DATA = Path("../src/data/raw/research_data.json")

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
    image_count = 0
    while data.tell() != datalen:
        width = read_short(data)
        height = read_short(data)    
        im = Image.frombytes("RGBA", (width, height), data.read(width * height * 4))
        im.save(outdir / f"{fp.stem}_{image_count}.png", optimize=True)
        small_size = [PREVIEW_SIZE[0], int(height * PREVIEW_SIZE[0] / width)] if width > height else [int(width * PREVIEW_SIZE[1] / height), PREVIEW_SIZE[1]]
        im.resize(small_size).save(outdir / f"{fp.stem}_{image_count}_small.webp", lossless=False, quality=75)
        image_count += 1
    return image_count

def main(args):
    researchdata = {}
    if RESEARCH_DATA.is_file():
        with RESEARCH_DATA.open() as f:
            researchdata = json.load(f)
    outdir = Path("../public/gameassets/research/")
    new_images = []
    for i in args:
        fp = Path(i)
        if fp.is_dir():
            # outdir = fp / "out/"
            # outdir.mkdir(exist_ok=True)
            for fp2 in fp.glob("**/*.brs"):
                researchdata[fp2.stem] = do_file(fp2, outdir=outdir)
            new_images += [outdir / f"{fp2.stem}_{i}.png" for i in range(researchdata[fp2.stem])]
        else:
            researchdata[fp.stem] = do_file(fp, outdir=outdir)
            new_images += [outdir / f"{fp.stem}_{i}.png" for i in range(researchdata[fp.stem])]
    with RESEARCH_DATA.open("w+") as f:
        json.dump(researchdata, f)
    if new_images:
        subprocess.run(["oxipng", "-o", "max", *new_images])

if __name__ == "__main__":
    main(sys.argv[1:] if len(sys.argv) > 1 else [r"C:\Program Files (x86)\Steam\steamapps\common\Beastieball"])
