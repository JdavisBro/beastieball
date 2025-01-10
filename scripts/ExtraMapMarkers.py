import sys
import json
from pathlib import Path

gamedir = Path(sys.argv[1])

OTHER_AREAS = [
  {
    "prefix": "sunken_stadium",
    "offset": [0, 8000],
  },
]

with (gamedir / "data_out" / "gift_table").open() as f:
  gift_data = json.load(f)

out_data = {"gifts": [], "switches": [], "walls": {}}

with list((gamedir / "world_data").glob("*world.json"))[0].open() as f:
  world_data = json.load(f)

level_stumps = {stump["name"]: stump for stump in world_data["level_stumps_array"]}

for level in (gamedir / "world_data").glob("**/*.json"):
  if "world" in level.name or "zerozero" in level.name:
    continue
  with level.open() as f:
    level_data = json.load(f)
  if level_data["name"] not in level_stumps:
    continue
  level_name = level_data["name"]
  stump = level_stumps[level_name]
  layer = stump["world_layer"] if "world_layer" in stump else 0 
  level_offset = ([area["offset"] for area in OTHER_AREAS if level_name.startswith(area["prefix"])] or [[0, 0]])[0] if layer != 0 else [0,0]
  for obj in level_data["objects_array"]:
    x = stump["world_x1"] + obj["x"] + level_offset[0]
    y = stump["world_y1"] + obj["y"] - (obj["z"] if "z" in obj else 0) + level_offset[1]
    if obj["object"] == "objGift":
      gift_id = f"gift_{level_data['name']}_{obj['gift_id_index']}" if obj["gift_id"] == "none" else obj['gift_id']
      if gift_id not in gift_data:
        print(f"GIFT NOT FOUND {gift_id}, {obj}")
        continue
      gift = gift_data[gift_id]
      out_data["gifts"].append({
        "id": gift_id,
        "items": [[gift[i+0], gift[i+1]] for i in range(0, len(gift), 2)],
        "x": x,
        "y": y,
      })
    elif obj["object"] == "objRailswitch":
      if stump.get("world_layer", 0) != 0:
        continue
      if x < stump["world_x1"] or x > stump["world_x2"] or y < stump["world_y1"] or y > stump["world_y2"]:
        continue
      out_data["switches"].append({
        "lever_id": obj.get("lever_id", level_name),
        "position": [x, y],
      })
    elif obj["object"] == "objRailwall":
      if stump.get("world_layer", 0) != 0:
        continue
      if x < stump["world_x1"] or x > stump["world_x2"] or y < stump["world_y1"] or y > stump["world_y2"]:
        continue
      lever_id = obj.get("lever_id", level_name)
      if lever_id not in out_data["walls"]:
        out_data["walls"][lever_id] = []
      out_data["walls"][lever_id].append({
        "position": [x, y],
        "angle": obj.get("angle", 0),
      })

with Path("../src/data/raw/extra_markers.json").open("w+") as f:
  json.dump(out_data, f)
