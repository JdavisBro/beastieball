import csv
import json
from pathlib import Path

import csv
import re
from pathlib import Path

data_dir = Path("../src/data/raw")

SEP_CHARACTER = "¬"
QUOTE_CHARACTER = "¦"

loc_dir = Path(r"C:\Program Files (x86)\Steam\steamapps\common\Beastieball\loc")

language_out_dir = Path(r"../src/localization/languages/")

INCLUDE_PREFIXES = [
  "_map_",
  "movedefine_0",
  "movedefine_descadd",
  "fieldeffectstuff",
  "statuseffectstuff",
]
required_keys = []

def get_keys(data) -> list[str] | None:
  if isinstance(data, str):
    if QUOTE_CHARACTER in data:
      data = data[1:-1]
      end = data.find(SEP_CHARACTER, 1)
      if end == -1:
        return [data]
      keys = [data[0:end]]
      values = data[end+1:].split(SEP_CHARACTER)
      i = 1
      while i < len(values):
        value = values[i]
        innerStart = value.find(QUOTE_CHARACTER)+1
        while innerStart != 0:
          innerEnd = value.find(SEP_CHARACTER, innerStart)
          if innerEnd == -1:
            innerEnd = value.find(QUOTE_CHARACTER, innerStart)
          if innerEnd != -1:
            keys.append(values[i][innerStart:innerEnd])
          innerStart = value.find(QUOTE_CHARACTER, innerEnd+1)+1
        i += 2
      return keys
    return None
  elif isinstance(data, (list, dict)):
    datas: list[str] = []
    for i in (data if isinstance(data, list) else data.values()):
      keys = get_keys(i)
      if keys:
        datas += keys
    return datas
  return None

for fp in data_dir.iterdir():
  with fp.open(encoding="utf8") as f:
    data = json.load(f)
  keys = get_keys(data)
  if keys:
    required_keys += keys

LANG_CODES = {
  "English": "en",
  "简体中文": "zh-CN",
  "Русский": "ru",
}

beastie_names = {}

for lang_fp in loc_dir.iterdir():
  if lang_fp.stem not in LANG_CODES:
    continue
  lang_code = LANG_CODES[lang_fp.stem]
  lang_out = {}
  with lang_fp.open(encoding="utf8", newline="") as f:
    reader = csv.reader(f)
    for line in reader:
      if line[0].startswith("beastiesetup_name_") or line[0] == "beastiesetup_013": # troglum
        if line[0] not in beastie_names:
          beastie_names[line[0]] = {}
        beastie_names[line[0]][lang_code] = line[1]
      elif line[0] in required_keys or any([line[0].startswith(i) for i in INCLUDE_PREFIXES]):
        lang_out[line[0]] = line[1]
  out_dir = (language_out_dir / lang_code / "game.json")
  out_dir.parent.mkdir(exist_ok=True)
  with out_dir.open("w+", encoding="utf8") as f:
    json.dump(lang_out, f, ensure_ascii=False, indent=2)

beastie_fp = language_out_dir.parent / "beastie_names.json"
with beastie_fp.open("w+", encoding="utf8") as f:
  json.dump(beastie_names, f, ensure_ascii=False, indent=2)
