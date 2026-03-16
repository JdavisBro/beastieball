import json
import re
from pathlib import Path

src_dir = Path("../src")

files = [
  "shared/MoveView.tsx"
]

game_file = src_dir / "localization" / "languages" / "en" / "game.json"

with game_file.open(encoding="utf8") as f:
  data = json.load(f)

for file in files:
  file = src_dir / file
  with file.open(encoding="utf8") as f:
    lines = f.readlines()
  prev_line_has_loc = False
  for i in range(len(lines)):
    line = lines[i]
    if line.strip().startswith("//") and prev_line_has_loc:
      lines[i] = line = ""
    strs = re.findall(r'"(.+?)"', line, re.U)
    locs = [data[match] for match in strs if match in data]
    if locs:
      index = line.find(" //")
      if index == -1: index = line.find("//")
      lines[i] = line[:index] + " // " + " -- ".join(locs) + "\n"
      prev_line_has_loc = True
    else:
      prev_line_has_loc = False
  with file.open("w+", encoding="utf8") as f:
    f.writelines(lines)