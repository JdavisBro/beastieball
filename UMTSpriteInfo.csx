using System.IO;
using UndertaleModLib.Util;

EnsureDataLoaded();

string exportDir = PromptChooseDirectory();

string output = "[\n";
bool first = true;

foreach (UndertaleSprite sprite in Data.Sprites) {
  if (!first) {
    output += "  },\n";
  } else {
    first = false;
  }
  output += "  {\n";
  output += "    \"name\": " + sprite.Name.ToString() + ",\n";
  output += "    \"width\": " + sprite.Width.ToString() + ",\n";
  output += "    \"height\": " + sprite.Height.ToString() + ",\n";
  output += "    \"frames\": " + sprite.Textures.Count.ToString() + ",\n";
  output += "    \"bbox\": {\n";
  ushort bboxX = 0;
  ushort bboxY = 0;
  int bboxEX = 0;
  int bboxEY = 0;
  bool firstdone = false;
  foreach (UndertaleSprite.TextureEntry entry in sprite.Textures) {
    if (entry.Texture == null) {continue;}
    if (entry.Texture.TargetWidth <= 1 && entry.Texture.TargetHeight <= 1) {continue;}
    if (!firstdone) {
      firstdone = true;
      bboxX = entry.Texture.TargetX;
      bboxY = entry.Texture.TargetY;
      bboxEX = entry.Texture.TargetWidth;
      bboxEY = entry.Texture.TargetHeight;
    } else {
      if (entry.Texture.TargetX < bboxX)
        bboxX = entry.Texture.TargetX;
      if (entry.Texture.TargetY < bboxY)
        bboxY = entry.Texture.TargetY;
      if (entry.Texture.TargetX + entry.Texture.TargetWidth > bboxEX)
        bboxEX = entry.Texture.TargetX + entry.Texture.TargetWidth;
      if (entry.Texture.TargetY + entry.Texture.TargetHeight > bboxEY)
        bboxEY = entry.Texture.TargetY + entry.Texture.TargetHeight;
    }
  }
  output += "        \"x\": " + bboxX.ToString() + ",\n";
  output += "        \"y\": " + bboxY.ToString() + ",\n";
  output += "        \"width\": " + (bboxEX - bboxX).ToString() + ",\n";
  output += "        \"height\": " + (bboxEY - bboxY).ToString() + "\n";
  output += "    }\n";
}
output += "  }\n]\n";

File.WriteAllText(exportDir + "/sprite_info.json", output);
