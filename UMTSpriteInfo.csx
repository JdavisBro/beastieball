using System.IO;
using UndertaleModLib.Util;

EnsureDataLoaded();

string exportDir = PromptChooseDirectory();

string output = "{\n";
bool first = true;
bool last_null = false;

foreach (UndertaleSprite sprite in Data.Sprites) {
  if (!first) {
    if (!last_null) {
      output += "  },\n";
    }
  } else {
    first = false;
  }
  if (sprite.Textures.Count == 0 || sprite.Textures[0].Texture == null) {
    output += "";
    last_null = true;
    continue;
  }
  last_null = false;
  output += "  " + sprite.Name.ToString() + ": {\n";
  // output += "    \"name\": " + sprite.Name.ToString() + ",\n";
  output += "    \"width\": " + sprite.Width.ToString() + ",\n";
  output += "    \"height\": " + sprite.Height.ToString() + ",\n";
  output += "    \"frames\": " + sprite.Textures.Count.ToString() + ",\n";
  output += "    \"originX\": " + sprite.OriginX.ToString() + ",\n";
  output += "    \"originY\": " + sprite.OriginY.ToString() + ",\n";
  output += "    \"bboxes\": [";
  ushort bboxX = 0;
  ushort bboxY = 0;
  int bboxEX = 0;
  int bboxEY = 0;
  bool firstdone = false;
  bool arrayfirstdone = false;
  foreach (UndertaleSprite.TextureEntry entry in sprite.Textures) {
    if (entry.Texture == null) {continue;}
    if (!arrayfirstdone) {
      arrayfirstdone = true;
      output += "\n      {\n";
    } else {
      output += ",\n      {\n";
    }
    output += "        \"x\": " + entry.Texture.TargetX.ToString() + ",\n";
    output += "        \"y\": " + entry.Texture.TargetY.ToString() + ",\n";
    output += "        \"width\": " + entry.Texture.TargetWidth.ToString() + ",\n";
    output += "        \"height\": " + entry.Texture.TargetHeight.ToString() + "\n";
    output += "      }";
    if (entry.Texture.TargetWidth <= 1 && entry.Texture.TargetHeight <= 1) {continue;}
    if (!firstdone) {
      firstdone = true;
      bboxX = entry.Texture.TargetX;
      bboxY = entry.Texture.TargetY;
      bboxEX = entry.Texture.TargetX + entry.Texture.TargetWidth;
      bboxEY = entry.Texture.TargetX + entry.Texture.TargetHeight;
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
  if (arrayfirstdone) {
    output += "\n    ],\n";
  } else {
    output += "],\n";
  }
  output += "    \"bbox\": {\n";
  output += "      \"x\": " + bboxX.ToString() + ",\n";
  output += "      \"y\": " + bboxY.ToString() + ",\n";
  output += "      \"width\": " + (bboxEX - bboxX).ToString() + ",\n";
  output += "      \"height\": " + (bboxEY - bboxY).ToString() + "\n";
  output += "    }\n";
}
if (last_null) {
  output += "\n}\n";
} else {
  output += "  }\n}\n";
}
File.WriteAllText(exportDir + "/sprite_info.json", output);
