# Updates beastie sprite bounds to ignore stray pixels
import json
from pathlib import Path

from PIL import Image, ImageFilter

spriteinfofp = Path("src/data/raw/sprite_info.json")

with spriteinfofp.open() as f:
  spriteinfo = json.load(f)

beasties = Path("public/gameassets/beasties/")

donesprites = []

for beastie in beasties.iterdir():
  print(beastie.name)
  for framefp in beastie.iterdir():
    frame = int(framefp.stem)
    im = Image.open(framefp)
    pilbbox = im.point(lambda p: p > 0).filter(ImageFilter.MedianFilter(3)).getbbox()
    if pilbbox:
      bbox = {"x": pilbbox[0], "y": pilbbox[1], "width": pilbbox[2] - pilbbox[0], "height": pilbbox[3] - pilbbox[1]}
      for spr in spriteinfo:
        if spr and spr["name"] == beastie.name and spr["bboxes"][frame] != bbox:
          if beastie.name not in donesprites: donesprites.append(beastie.name)
          spr["bboxes"][frame] = bbox

print("Updating main bboxes.")
for beastie in donesprites:
  for spr in spriteinfo:
    if spr and spr["name"] == beastie:
      bbox = spr["bbox"]
      bbox = {
        "x": bbox["x"], "y": bbox["y"],
        "x2": bbox["x"] + bbox["width"], "y2": bbox["y"] + bbox["height"]
      }
      for framebbox in spr["bboxes"]:
        if framebbox["x"] < bbox["x"]: bbox["x"] = framebbox["x"]
        if framebbox["y"] < bbox["y"]: bbox["y"] = framebbox["y"]
        if framebbox["x"] + framebbox["width"] > bbox["x2"]: bbox["x2"] = framebbox["x"] + framebbox["width"]
        if framebbox["y"] + framebbox["height"] > bbox["y2"]: bbox["y2"] = framebbox["y"] + framebbox["height"]
      spr["bbox"] = {
        "x": bbox["x"], "y": bbox["y"],
        "width": bbox["x2"] - bbox["x"],
        "height": bbox["y2"] - bbox["y"]
      }

with spriteinfofp.open("w+") as f:
  json.dump(spriteinfo, f)
