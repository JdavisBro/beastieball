export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [0, 0, 0];
}

export function bgrDecimalToRgb(bgr: number) {
  return [
    (bgr & 0xff) / 255,
    ((bgr >> 8) & 0xff) / 255,
    ((bgr >> 16) & 0xff) / 255,
  ];
}

export function bgrDecimalToHex(bgr: number) {
  return (
    (bgr & 0xff).toString(16).padStart(2, "0") +
    ((bgr & 0xff00) >> 8).toString(16).padStart(2, "0") +
    ((bgr & 0xff0000) >> 16).toString(16).padStart(2, "0")
  );
}

export type BeastieColorSet = Array<{ color: number; x: number }>;

export function getColorInBeastieColors(
  x: number,
  colorset: BeastieColorSet,
): number[] {
  if (x > 1 || x < 0) {
    throw Error("Invalid beastie color params.");
  }
  if (x == 0) {
    return bgrDecimalToRgb(colorset[0].color);
  }
  if (x == 1) {
    return bgrDecimalToRgb(colorset[colorset.length - 1].color);
  }
  let range: number[] = [];
  colorset.some((value, index) => {
    if (x < value.x) {
      if (index == 0) {
        range = [index];
      } else if (colorset[index - 1].x == x) {
        range = [index - 1];
      } else {
        range = [index - 1, index];
      }
      return true;
    } else if (x == value.x) {
      range = [index];
      return true;
    }
    return false;
  });
  if (range.length == 0) {
    return bgrDecimalToRgb(colorset[colorset.length - 1].color);
  } // if we don't have a range then x is larger than all of the color.x's so use last
  if (range.length == 1) {
    return bgrDecimalToRgb(colorset[range[0]].color);
  }
  const lowerColor = bgrDecimalToRgb(colorset[range[0]].color);
  const upperColor = bgrDecimalToRgb(colorset[range[1]].color);
  const w2 =
    (x - colorset[range[0]].x) / (colorset[range[1]].x - colorset[range[0]].x);
  const w1 = 1 - w2;
  return [
    lowerColor[0] * w1 + upperColor[0] * w2,
    lowerColor[1] * w1 + upperColor[1] * w2,
    lowerColor[2] * w1 + upperColor[2] * w2,
  ];
}
