# Combo Info

## Basic

Combo moves (and probably every other move in the game) are made up of arrays of attributes. These attributes take the form of three numbers. The first is the ID, which is a type of effect the move has. Second are third are arguments specific to that type. If there is only 1 argument, the second value is unused.

For combo moves, two beasties attributes for that type of relationship are combined to make one move. Combo data is found in beastie_data.json in the "combo" key for each beastie. The type of relationship each array is for is in this order: rival, partner, beastie defence, bestie support.

For example: Rookee and Sefren's support bestie arrays are `[12, 8, 2]` and `[7, 2, 0]` which mean `Other team gains 2 Angry.` and `SHIFTs active team to front row.`. So their support beastie move would be `[12, 8, 2, 7, 2, 0]` and mean `Other team gains 2 Angry. SHIFTs active team to front row.`

We currently don't know what determines bestie move type and rival move type.

## Shared Arg Types:

- Target
  - 0: `self`
  - 1: `ally`
  - 2: `team`
  - 3: `enemyTeam` ? possibly
- Effect
  - 1: `jazzed`
  - 3: `tender`
  - 8: `angry`
- Position
  - 0: `front`/`net`
  - 1: `back`

## Combo Types:

- Shift

  - `[ 7, target, position ]`

- Status > Enemy Team

  - `[ 12, effect, length ]`

- Status > Ally

  - `[ 26, effect, length ]`

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
