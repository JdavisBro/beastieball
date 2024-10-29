import sys
import shutil
import json
from pathlib import Path

gameDir = Path(sys.argv[1])
voDir = gameDir / "audio" / "vo"

outDir = Path("public/gameassets/audio/")
outFile = Path("src/data/raw/beastieSfx.json")

beastie_vo = {} # id: {hello: int, boo: int, cheer: int}
print(voDir)
for fp in voDir.glob("**/*.wav"):
  print(fp)
  num = int(fp.stem.split("_")[-1])
  fn = fp.parent.name.split("_")
  bid = "_".join(fn[1:-1])
  typ = fn[-1]
  print(bid, typ, num)
  if bid in beastie_vo:
    beastie_vo[bid][typ] = max(typ in beastie_vo[bid] and beastie_vo[bid][typ] or 0, num)
  else:
    beastie_vo[bid] = {typ: num}
  op = outDir / bid / f"{typ}_{num}{fp.suffix}"
  op.parent.mkdir(parents=True, exist_ok=True)
  shutil.copy(fp, op)

with outFile.open("w+") as f:
  json.dump(beastie_vo, f)
