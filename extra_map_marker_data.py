import sys
import json
from pathlib import Path

gamedir = Path(sys.argv[1])

with (gamedir / "data_out" / "gift_table").open() as f:
  gift_data = json.load(f)

out_data = {"gifts": []}

with list((gamedir / "world_data").glob("*world.json"))[0].open() as f:
  world_data = json.load(f)

level_stumps = {stump["name"]: stump for stump in world_data["level_stumps_array"]}

for level in (gamedir / "world_data").glob("**/*.json"):
  if "world" in level.name or "zerozero" in level.name:
    continue
  with level.open() as f:
    level_data = json.load(f)
  stump = level_stumps[level_data["name"]]
  for obj in level_data["objects_array"]:
    if obj["object"] == "objGift":
      gift_id = f"gift_{level_data['name']}_{obj['gift_id_index']}" if obj["gift_id"] == "none" else obj['gift_id']
      if gift_id not in gift_data:
        print(f"GIFT NOT FOUND {gift_id}, {obj}")
        exit()
      gift = gift_data[gift_id]
      out_data["gifts"].append({
        "id": gift_id,
        "items": [[gift[0], gift[1]] for i in range(0, len(gift), 2)],
        "x": stump["world_x1"] + obj["x"],
        "y": stump["world_y1"] + obj["y"],
      })

with Path("src/data/raw/extra_markers.json").open("w+") as f:
  json.dump(out_data, f)