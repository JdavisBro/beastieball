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
