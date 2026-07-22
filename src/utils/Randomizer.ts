const m = 4294967296;
const c = 1;
const a = 22695477;

export default class Randomizer {
  i = 0;

  constructor(seed?: number) {
    if (seed) {
      this.set_seed(seed);
    } else {
      this.randomize();
    }
  }

  set_seed(seed: number) {
    this.i = seed % m;
  }

  randomizer_seed(seed: number, randomizer: number = 1000000007) {
    this.i = (seed + randomizer) % m;
  }

  randomize() {
    this.i = Math.random() * m;
  }

  random(max: number = 1) {
    this.i = (this.i * a + c) % m;
    return max * Math.abs(this.i / m);
  }

  spam_random(times: number) {
    for (let i = 0; i < times; i++) {
      this.random();
    }
  }
}

const RCHAR_KEY = "0123456789BCDFGHJKLMNPQRTVWXY";
const BASE = RCHAR_KEY.length;

export function seedToString(seed: number) {
  let value = "";
  while (seed > 0) {
    const mod = Math.floor(seed % BASE);
    value = RCHAR_KEY[mod] + value;
    seed = Math.floor(seed / BASE);
  }
  return value;
}

export function seedFromString(str_seed: string) {
  str_seed = str_seed.toUpperCase();
  let length = str_seed.length;
  let value = 0;
  let index = 0;
  while (length) {
    const pos = RCHAR_KEY.indexOf(str_seed[length - 1]);
    if (pos != -1) {
      value += pos * BASE ** index;
      index += 1;
    }
    length -= 1;
  }
  return value;
}
