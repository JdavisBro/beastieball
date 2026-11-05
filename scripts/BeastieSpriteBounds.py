# Updates beastie sprite bounds to ignore stray pixels
import sys
import json
import subprocess
import time
from pathlib import Path

from PIL import Image, ImageFilter

spriteinfofp = Path("../src/data/raw/sprite_info.json")

with spriteinfofp.open() as f:
  spriteinfo = json.load(f)

beasties = Path("../public/gameassets/beasties/")

donesprites = []

add_modded = len(sys.argv) > 1 and sys.argv[1] == "modded"
currentProcesses: list[subprocess.Popen] = []

TOTAL_PROCESSES = 12

def wait_for_process():
  waiting = True
  while waiting:
    for process in list(currentProcesses):
      completed = process.poll()
      if completed is not None:
        currentProcesses.remove(process)
        waiting = False
        break
    time.sleep(0.05)

for beastie in beasties.iterdir():
  convert_webp = False
  if beastie.name not in spriteinfo:
    convert_webp = True
    frames_count = len([i for i in beastie.iterdir() if i.stem != "HITBOX" and i.suffix.endswith("png")])
    has_hitbox = (beastie / "HITBOX.png").exists()
    hitbox = Image.open(beastie / "HITBOX.png") if has_hitbox else Image.open([i for i in beastie.iterdir()][2])
    bbox = hitbox.getbbox()
    spriteinfo[beastie.name] = {
      "width": hitbox.width,
      "height": hitbox.height,
      "frames": frames_count,
      "originX": bbox[0] + (bbox[2] - bbox[0]) / 2,
      "originY": bbox[3],
      "bboxes": [None for _ in range(frames_count)],
    }
  elif add_modded:
    continue
  has_zero = (beastie / "0.png").exists()
  print(beastie.name)
  for framefp in beastie.iterdir():
    print(framefp)
    if framefp.stem == "HITBOX": continue
    frame = int(framefp.stem) - (0 if has_zero else 1)
    im = Image.open(framefp)
    pilbbox = im.point(lambda p: p > 0).filter(ImageFilter.MedianFilter(3)).getbbox()
    if pilbbox:
      bbox = {"x": pilbbox[0], "y": pilbbox[1], "width": pilbbox[2] - pilbbox[0], "height": pilbbox[3] - pilbbox[1]}
    else:
      bbox = None
    spr = spriteinfo.get(beastie.name)
    if not spr:
      continue
    if len(spr["bboxes"]) <= frame:
      print(f"TOO MANY FRAMES!! {beastie.name}")
      continue
    if spr["bboxes"][frame] == bbox:
      continue
    if beastie.name not in donesprites:
      donesprites.append(beastie.name)
    spr["bboxes"][frame] = bbox
    if len(currentProcesses) == TOTAL_PROCESSES:
      wait_for_process()
    currentProcesses.append(subprocess.Popen(["cwebp", "-quiet", "-z", "9", str(framefp), "-o", str(beastie / f"{frame}.webp")]))

while currentProcesses:
  wait_for_process()

print("Updating main bboxes.")
for beastie in donesprites:
  spr = spriteinfo[beastie]
  if not spr:
    continue
  bbox = [i for i in spr["bboxes"] if i][0]
  bbox = {
    "x": bbox["x"], "y": bbox["y"],
    "x2": bbox["x"] + bbox["width"], "y2": bbox["y"] + bbox["height"]
  }
  for framebbox in spr["bboxes"]:
    if not framebbox:
      continue
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
