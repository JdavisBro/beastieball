import sys
import shutil
import json
import numpy
from pathlib import Path

from pedalboard import PitchShift
from pedalboard.io import AudioFile

gameDir = Path(sys.argv[1] if len(sys.argv) > 1 else r"C:\Program Files (x86)\Steam\steamapps\common\Beastieball")
voDir = gameDir / "audio" / "vo"

outDir = Path("../public/gameassets/audio/")
outFile = Path("../src/data/raw/beastieSfx.json")

with (gameDir / "audio_data.json").open() as f:
  audio_data = {(i["name"] if "name" in i else ""): i for i in json.load(f)[0]}

def percent_to_semitone(percent):
  if percent < 0:
    return 24 * (percent / 100)
  else:
    return 12 * (percent / 100)

beastie_vo = {} # id: {hello: int, boo: int, cheer: int}
for fp in voDir.glob("**/*.wav"):
  num = int(fp.stem.split("_")[-1])
  fn = fp.parent.name.split("_")
  bid = "_".join(fn[1:-1])
  if bid.startswith("iceCream"):
    continue
  typ = fn[-1]
  op = outDir / bid / f"{typ}_{num}.flac"
  op.parent.mkdir(parents=True, exist_ok=True)
  data = audio_data[f"vo_{bid}_{typ}"]
  if not any([fp.name in p for p in data["contents_serialize"]]):
    continue
  if bid in beastie_vo:
    beastie_vo[bid][typ] = max(typ in beastie_vo[bid] and beastie_vo[bid][typ] or 0, num)
  else:
    beastie_vo[bid] = {typ: num}
  pitch = data["pitch"] if "pitch" in data else 0
  shifter = PitchShift(semitones=percent_to_semitone(pitch))
  if pitch:
    print(fp, pitch)
  with AudioFile(str(fp), "r") as f:
    with AudioFile(str(op), "w", f.samplerate, f.num_channels) as fw:
      fw.write(shifter(f.read(f.frames), f.samplerate))
      fw.write(numpy.zeros((f.num_channels, f.samplerate))) # Add padding second

with outFile.open("w+") as f:
  json.dump(beastie_vo, f)

