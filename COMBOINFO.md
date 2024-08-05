# Combo Info

## Basic

Combo moves (and probably every other move in the game) are made up of arrays of attributes. These attributes take the form of three numbers. The first is the ID, which is a type of effect the move has. Second are third are arguments specific to that type. If there is only 1 argument, the second value is unused.

For combo moves, two beasties attributes for that type of relationship are combined to make one move. Combo data is found in beastie_data.json in the "combo" key for each beastie. The type of relationship each array is for is in this order: rival, partner, beastie support, bestie defence.

For example: Rookee and Sefren's support bestie arrays are `[12, 8, 2]` and `[7, 2, 0]` which mean `Other team gains 2 Angry.` and `SHIFTs active team to front row.`. So their support beastie move would be `[12, 8, 2, 7, 2, 0]` and mean `Other team gains 2 Angry. SHIFTs active team to front row.`

We currently don't know what determines bestie move type and rival move type.

Values in combo corrospond to the move_dic values as such:

`[eff, targ, pow]`

## Shared Arg Types:

- Target

  - 0: `self`
  - 1: `ally`
  - 2: `team`
  - 3: `target (enemy)`
  - 5: `enemy team`

  - 7: `every fielded player`

- Effect
  - 1: `jazzed`
  - 3: `tender`
  - 8: `angry`
- Position
  - 0: `back`
  - 1: `front`/`net`

## Combo Types:

- POW/DEF change

  - `[ 0 - 5, target, value ]`
  - 0 does body pow, 1 does spirit pow, 2 does mind pow
  - 3 does body def, 4 does spirit def, 5 does mind def
  - value is increase (eg -2, -1, +1, +2)

> [sprIcon,0/1/2]POW/DEF[sprBoost,0/1/2/3/4/5] to TARGET.

- Feel Nervous

  - `[ 6, target, pow ]`

> TARGET feels POW [spr]NERVOUS

- Shift

  - `[ 7, target, position ]`

- Status > Enemy Team

  - `[ 12, effect, length ]`

- Status > Ally

  - `[ 26, effect, length ]`
  - `[ 26, target, effect ]` actually?

- Dynamic Power Multiplier

  - `[ 33, 0, dynPowMultType ]`

  - dynPowMultType:
    - 19: `POW +50% for each pass`
    - 20: `POW x2 if just tagged in`

- Status > Attack Target

  - `[ 38, effect, length ]`

- Power Multiplier

  - `[ 47, 0, multiplier ]`

- Build

  - `[ 53, target?, position? ]`
  - I'm not sure on the args, this is only used once for build and the only target is team.
