import json
from pathlib import Path

spawner_levels = []

levels = Path(".")
for level in levels.glob("**/*.json"):
  with level.open() as f:
    try:
      data = json.load(f)
    except json.JSONDecodeError:
      continue
    if "_" not in data or data["_"] != "class_level":
      continue
    spawner = False
    for obj in data["objects_array"]:
      if obj["object"] == "objSpawner":
        spawner = True
        break
    if not spawner:
      continue
    spawner_levels.append(data["name"])

print(spawner_levels)
