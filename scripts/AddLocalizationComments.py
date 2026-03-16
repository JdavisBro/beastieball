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
  for i in range(len(lines)):
    line = lines[i]
    strs = re.findall(r'"(.+?)"', line, re.U)
    locs = [data[match] for match in strs if match in data]
    if locs:
      index = line.find(" //")
      if index == -1: index = line.find("//")
      lines[i] = line[:index] + " // " + " -- ".join(locs) + "\n"
  with file.open("w+", encoding="utf8") as f:
    f.writelines(lines)