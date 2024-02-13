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
  output += "    \"height\": " + sprite.Height.ToString() + "\n";
}
output += "  }\n]\n";

File.WriteAllText(exportDir + "/sprite_info.json", output);
