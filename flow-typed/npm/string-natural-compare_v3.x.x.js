// flow-typed signature: 800f53a3850cdb262f83c0000e5bc565
// flow-typed version: d8a68b7d56/string-natural-compare_v3.x.x/flow_>=v0.83.x

declare module 'string-natural-compare' {
  declare function naturalCompare(
    a: string,
    b: string,
    options?: {|
      caseInsensitive?: boolean,
      alphabet?: string,
    |},
  ): number;

  declare module.exports: typeof naturalCompare;
}
