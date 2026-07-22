import { useState } from "react";
import MoveView from "../shared/MoveView";
import { WorkshopPlay } from "./types";
import { StringDataInput } from "./Workshop";
import { MoveEffect, MoveEffectID } from "../data/MoveData";
import abilities from "../data/abilities";
import useLocalization from "../localization/useLocalization";
import BeastieSelect from "../shared/BeastieSelect";
import BEASTIE_DATA from "../data/BeastieData";

type EffectInfo = {
  targetSelector?: (props: {
    target: number;
    setTarget: (target: number) => void;
    effectInfo: EffectInfo;
  }) => React.ReactNode;
  powSelector?: (props: {
    pow: number | string;
    setPow: (pow: number | string) => void;
    effectInfo: EffectInfo;
  }) => React.ReactNode;
  effChangeCallback?: (effect: MoveEffect) => MoveEffect;
  min?: number;
  max?: number;
  step?: number;
};

function AbilityInput({
  pow,
  setPow,
}: {
  pow: string;
  setPow: (pow: string) => void;
}) {
  const { L } = useLocalization();

  const sorted_abilities = Object.values(abilities).sort((a, b) =>
    L(a.name).localeCompare(L(b.name)),
  );

  return (
    <select onChange={(event) => setPow(event.currentTarget.value)} value={pow}>
      {sorted_abilities.map((ability) => (
        <option value={ability.id}>{L(ability.name)}</option>
      ))}
    </select>
  );
}

function DamageAdjustInput({
  pow,
  setPow,
}: {
  pow: number;
  setPow: (pow: number) => void;
}) {
  return (
    <select
      onChange={(event) => setPow(Number(event.currentTarget.value))}
      value={pow}
    >
      <option value={0}>Add user's STAMINA to Pow</option>
      <option value={1}>Strongest when user has less STAMINA</option>
      <option value={2}>Uses Body Defense</option>
      <option value={3}>Uses Spirit Defense</option>
      <option value={4}>Uses Mind Defense</option>
      <option value={5}>Pow x2 if target just TAGGED IN</option>
      <option value={6}>Pow x2 if target just MOVED</option>
      <option value={7}>Pow x2 if used to Serve</option>
      <option value={8}>Strongest when target has more STAMINA</option>
      <option value={9}>Pow x2 if target STAMINA is below 50</option>
      <option value={10}>Pow +10 for each ^BOOST on user</option>
      <option value={11}>Pow +100% for each ^BOOST on target</option>
      <option value={12}>Pow x2 if user SWEATY, NERVOUS, TENDER, WEEPY</option>
      <option value={13}>Pow x2 if target has a bad feeling</option>
      <option value={14}>Ignores shields and ^BOOSTS</option>
      <option value={15}>Pow x1.5 if tied or behind on score</option>
      <option value={16}>Does more damage to back-row targets</option>
      <option value={17}>Ignores BLOCKED</option>
      <option value={18}>Pow x1.5 if user recieved the ball</option>
      <option value={19}>Pow +50% for each volley between allies</option>
      <option value={20}>Pow x2 if user recently TAGGED IN</option>
      <option value={21}>Pow +25% for each vBOOST on target</option>
      <option value={22}>Always uses target's weakest DEF</option>
      <option value={23}>Always uses target's strongest DEF</option>
      <option value={24}>Pow +10 for each vBOOST on user</option>
      <option value={25}>Always boosted by RALLY</option>
      <option value={26}>Pow x1.5 if user changed position this turn</option>
      <option value={27}>Pow x2 when user STAMINA is below 34</option>
      <option value={28}>Ignores user's BOOSTs and JAZZED</option>
      <option value={29}>Pow x2 if there are any Field Effects</option>
      <option value={30}>Pow x1.5 if user has 2+ ACTIONs</option>
      <option value={31}>Pow x1.5 if user is JAZZED</option>
      <option value={32}>Pow x0.75 if user has any Feelings</option>
      <option value={33}>Ignores damage reduction from RALLY</option>
      <option value={34}>Pow +20 for each stack of SWEATY on user</option>
      <option value={35}>Damages from back row</option>
      <option value={36}>Damages from front row</option>
    </select>
  );
}

const DEFAULT_EFFECT_INFO: EffectInfo &
  Required<Pick<EffectInfo, "targetSelector" | "powSelector">> = {
  targetSelector: ({ target, setTarget }) => (
    <select
      onChange={(event) => setTarget(Number(event.target.value))}
      value={target}
    >
      <option value={0}>User</option>
      <option value={1}>Ally</option>
      <option value={2}>Active Team</option>
      <option value={3}>Target</option>
      <option value={4}>Target Team</option>
      <option value={5}>Target's Ally</option>
      <option value={6}>Entire Team</option>
      <option value={7}>Every Fielded Player</option>
      <option value={8}>Other Team</option>
      <option value={9}>Nearest Enemy</option>
      <option value={10}>Front Row Active Team</option>
      <option value={11}>Active Team</option>
      <option value={12}>User and Target</option>
    </select>
  ),
  powSelector: ({ pow, setPow, effectInfo }) => (
    <input
      type="number"
      value={typeof pow == "number" ? pow : 0}
      onChange={(event) => setPow(Number(event.currentTarget.value))}
      min={effectInfo.min}
      max={effectInfo.max}
      step={effectInfo.step}
    />
  ),
};

const DEFAULT_FIELD_TARGET: EffectInfo = {
  targetSelector: ({ target, setTarget }) => (
    <select
      onChange={(event) => setTarget(Number(event.target.value))}
      value={target}
    >
      <option value={0}>Ally Field</option>
      <option value={3}>Opponent Field</option>
      <option value={7}>Entire Field</option>
    </select>
  ),
};

const NO_SELECTORS: EffectInfo = {
  targetSelector: () => {},
  powSelector: () => {},
};

const FIELD_SELECTOR: EffectInfo = {
  targetSelector: DEFAULT_FIELD_TARGET.targetSelector,
  powSelector: ({ pow, setPow }) => (
    <select
      value={pow}
      onChange={(event) => setPow(Number(event.currentTarget.value))}
    >
      <option value={0}>Rally</option>
      <option value={1}>Trap</option>
      <option value={2}>Rhythm</option>
      <option value={3}>Dread</option>
      <option value={5}>Quake</option>
    </select>
  ),
};

const FEELING_SELECTOR: EffectInfo = {
  powSelector: ({ pow, setPow }) => (
    <select
      value={pow}
      onChange={(event) => setPow(Number(event.currentTarget.value))}
    >
      <option value={0}>Nervous</option>
      <option value={1}>Angry</option>
      <option value={2}>Shook</option>
      <option value={3}>Noisy</option>
      <option value={4}>Tough</option>
      <option value={5}>Wiped</option>
      <option value={6}>Sweaty</option>
      {/* <option value={7}>Aware</option> */}
      <option value={8}>Jazzed</option>
      <option value={9}>Blocked</option>
      <option value={10}>Tired</option>
      <option value={11}>Tender</option>
      <option value={12}>Stressed</option>
      <option value={13}>Weepy</option>
    </select>
  ),
};

const EFFECT_INFO: Partial<Record<MoveEffectID, EffectInfo>> = {
  33: {
    // Damage Adjust
    targetSelector: () => null,
    powSelector: ({ pow, setPow }) => (
      <DamageAdjustInput
        pow={typeof pow == "number" ? pow : 0}
        setPow={setPow}
      />
    ),
  },
  89: {
    powSelector: ({ pow, setPow }) => (
      <AbilityInput
        pow={typeof pow == "string" ? pow : "haunted"}
        setPow={setPow}
      />
    ),
    effChangeCallback: (effect) => ({
      eff: 89,
      targ: effect.targ,
      pow:
        typeof effect.pow == "string" && abilities[effect.pow]
          ? effect.pow
          : "haunted",
    }),
  },
  42: DEFAULT_FIELD_TARGET,
  43: DEFAULT_FIELD_TARGET,
  44: DEFAULT_FIELD_TARGET,
  45: DEFAULT_FIELD_TARGET,
  70: DEFAULT_FIELD_TARGET,
  56: DEFAULT_FIELD_TARGET,
  46: DEFAULT_FIELD_TARGET,

  17: NO_SELECTORS,
  18: NO_SELECTORS,
  61: NO_SELECTORS,
  71: NO_SELECTORS,
  73: NO_SELECTORS,
  83: NO_SELECTORS,
  84: { targetSelector: () => {}, step: 0.1 },
  91: NO_SELECTORS,

  10: { targetSelector: () => {} },
  86: { targetSelector: () => {} },
  87: NO_SELECTORS,

  40: NO_SELECTORS,
  41: NO_SELECTORS,
  57: NO_SELECTORS,
  67: NO_SELECTORS,
  69: {
    targetSelector: () => {},
    powSelector: ({ pow, setPow }) => (
      <select
        value={pow}
        onChange={(event) => setPow(Number(event.currentTarget.value))}
      >
        <option value={0}>Not Hittable</option>
        <option value={1}>Hittable</option>
      </select>
    ),
  },

  64: FIELD_SELECTOR,

  95: FEELING_SELECTOR,
  96: FEELING_SELECTOR,

  8: { step: 0.01 },
};

function EffectSelect({
  effect,
  setEffect,
  deleteEffect,
  moveEffect,
  first,
  last,
}: {
  effect?: MoveEffect;
  setEffect: (effect: MoveEffect) => void;
  deleteEffect?: () => void;
  moveEffect?: (dir: number) => void;
  first?: boolean;
  last?: boolean;
}) {
  const effectInfo = EFFECT_INFO[effect?.eff ?? 0] ?? DEFAULT_EFFECT_INFO;

  const TargetSelector =
    effectInfo.targetSelector ?? DEFAULT_EFFECT_INFO.targetSelector;
  const PowSelector = effectInfo.powSelector ?? DEFAULT_EFFECT_INFO.powSelector;

  return (
    <div>
      <select
        value={effect ? effect.eff : -9999}
        onChange={(event) =>
          setEffect(
            effect
              ? ({ ...effect, eff: Number(event.target.value) } as MoveEffect)
              : ({
                  eff: Number(event.target.value),
                  targ: 0,
                  pow: 1,
                } as MoveEffect),
          )
        }
      >
        <option value={-9999} disabled>
          - Add New Effect -
        </option>
        <optgroup label="Boosts">
          <option value={0}>Body POW Change</option>
          <option value={1}>Spirit POW Change</option>
          <option value={2}>Mind POW Change</option>
          <option value={3}>Body DEF Change</option>
          <option value={4}>Spirit DEF Change</option>
          <option value={5}>Mind DEF Change</option>
          <option value={74}>Body + Spirit POW Change</option>
          <option value={75}>Body + Mind POW Change</option>
          <option value={76}>Spirit + Mind POW Change</option>
          <option value={77}>Body + Spirit DEF Change</option>
          <option value={78}>Body + Mind DEF Change</option>
          <option value={79}>Spirit + Mind DEF Change</option>
          <option value={15}>All POW Change</option>
          <option value={16}>All DEF Change</option>
          <option value={93}>Weakest DEF Change</option>
          <option value={31}>Transfer Boosts to Target</option>
          <option value={34}>Reset Boosts</option>
        </optgroup>
        <optgroup label="Feelings">
          <option value={6}>Feel NERVOUS</option>
          <option value={12}>Feel ANGRY</option>
          <option value={13}>Feel SHOOK</option>
          <option value={14}>Feel NOISY</option>
          <option value={19}>Feel TOUGH</option>
          <option value={22}>Feel WIPED</option>
          <option value={23}>Feel SWEATY</option>
          <option value={26}>Feel JAZZED</option>
          <option value={27}>Feel BLOCKED</option>
          <option value={29}>Feel TIRED</option>
          <option value={38}>Feel TENDER</option>
          <option value={39}>Feel STRESSED</option>
          <option value={80}>Feel WEEPY</option>
          <option value={53}>Combine Feelings</option>
          <option value={95}>Cure a Single Feeling</option>
          <option value={52}>Cure Bad Feelings (except ANGRY)</option>
          <option value={32}>Cure All Feelings (except ANGRY)</option>
          <option value={94}>Cure Good Feelings (except ANGRY)</option>
        </optgroup>
        <optgroup label="Field">
          <option value={42}>TRAP</option>
          <option value={43}>RALLY</option>
          <option value={44}>RHYTHM</option>
          <option value={45}>DREAD</option>
          <option value={70}>QUAKE</option>
          <option value={56}>BARRIER</option>
          <option value={46}>Clear Field</option>
        </optgroup>
        <optgroup label="Stamina">
          <option value={8}>STAMINA Heal/Damage</option>
          <option value={82}>Max Stamina</option>
          <option value={47}>Fully Restore</option>
          <option value={92}>Evenly Shares Stamina with Target</option>
        </optgroup>
        <optgroup label="Move">
          <option value={7}>SHIFT</option>
          <option value={11}>Swap With Ally</option>
          <option value={28}>Swap With Ally without moving Ball</option>
          <option value={30}>TAG OUT</option>
        </optgroup>
        <optgroup label="Trait">
          <option value={63}>Trait Swap</option>
          <option value={65}>User's Trait becomes Target's</option>
          <option value={81}>Target's Trait becomes User's</option>
          <option value={89}>Trait Set</option>
        </optgroup>
        <optgroup label="Attack">
          <option value={33}>Damage Adjust</option>
          <option value={17}>Can use without Volleying</option>
          <option value={18}>Gives an Easy Recieve</option>
          <option value={71}>Automatically Volleys on recieve</option>
          <option value={73}>Can't be redirected</option>
          <option value={61}>Can use when TIRED, SHOOK or WIPED</option>
          <option value={91}>Ignores Target's Trait</option>
          <option value={83}>Mimic ally's first Attack</option>
          <option value={84}>POW Multiply</option>
        </optgroup>
        <optgroup label="Usage">
          <option value={20}>Pass/Volley</option>
          <option value={86}>Charges Up</option>
          <option value={87}>Charge Resets on Use</option>
          <option value={10}>+/- ACTIONs</option>
          <option value={40}>Requires 2 ACTIONs</option>
          <option value={41}>Requires 3 ACTIONs</option>
          <option value={57}>Can't use if space is obstructed</option>
          <option value={67}>Can be used during Defense</option>
          <option value={69}>Can only be used if ball is/isn't Volleyed</option>
        </optgroup>
        <optgroup label="Effect Condition">
          <option value={72}>If ball is hittable</option>
          <option value={90}>If previous effect succeeded</option>
          <option value={85}>If ally can Block</option>
          <option value={64}>If FIELD EFFECT</option>
          <option value={88}>If target STAMINA greater</option>
          <option value={96}>If target feels</option>
        </optgroup>
      </select>
      {effect && moveEffect && deleteEffect && (
        <>
          <TargetSelector
            target={effect.targ}
            setTarget={(target) => setEffect({ ...effect, targ: target })}
            effectInfo={effectInfo}
          />
          <PowSelector
            pow={effect.pow}
            setPow={(pow) => setEffect({ ...effect, pow: pow } as MoveEffect)}
            effectInfo={effectInfo}
          />
          <button onClick={() => moveEffect(-1)} disabled={first}>
            ^
          </button>
          <button onClick={() => moveEffect(1)} disabled={last}>
            v
          </button>
          <button onClick={deleteEffect}>-</button>
        </>
      )}
    </div>
  );
}

export default function WorkshopEditPlay({
  play,
  setPlay,
  deletePlay,
}: {
  play: WorkshopPlay;
  setPlay: React.Dispatch<React.SetStateAction<WorkshopPlay>>;
  deletePlay: () => void;
}) {
  const { L } = useLocalization();

  const [idAccum, setIdAccum] = useState(0);

  const [pow, setPow] = useState(String(play.pow));

  const setKey: <T extends keyof WorkshopPlay>(
    key: T,
    value: WorkshopPlay[T],
  ) => void = (key, value) => {
    setPlay((old_play) => ({ ...old_play, [key]: value }));
    setIdAccum(idAccum + 1);
  };

  return (
    <>
      <div
        className="infoBoxContent"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <label>
          Name:{" "}
          <StringDataInput
            value={play.name}
            setValue={(new_value) => setKey("name", new_value)}
          />
        </label>
        <label>
          Type:{" "}
          <select
            value={String(play.type)}
            onChange={(event) => {
              const new_type = Number(event.target.value);
              setKey("type", new_type);
              if (new_type < 3 != play.type < 3) setKey("target", 0);
            }}
          >
            <option value={0}>Body</option>
            <option value={1}>Spirit</option>
            <option value={2}>Mind</option>
            <option value={3}>Volley</option>
            <option value={4}>Support</option>
            <option value={5}>Defense</option>
          </select>
        </label>
        <label>
          Pow:{" "}
          <input
            type="number"
            value={pow}
            onChange={(event) => {
              if (
                event.target.value.length &&
                !isNaN(Number(event.target.value))
              )
                setKey("pow", Number(event.target.value ?? 0));
              setPow(event.target.value);
            }}
          />
        </label>
        <label>
          Use:{" "}
          <select
            value={String(play.use)}
            onChange={(event) => setKey("use", Number(event.target.value))}
          >
            <option value={0}>Anywhere</option>
            <option value={1}>Back Row</option>
            <option value={2}>Front Row</option>
          </select>
        </label>
        <label>
          Target:{" "}
          <select
            value={String(play.target)}
            onChange={(event) => setKey("target", Number(event.target.value))}
          >
            {play.type < 3 ? (
              <>
                <option value={0}>Straight Line</option>
                <option value={1}>Straight Ahead</option>
                <option value={4}>Front Row</option>
                <option value={8}>Back Row</option>
                <option value={12}>Sideways</option>
                <option value={13}>Nearest Opponent</option>
                <option value={3}>Benched Ally (Straight Ahead)</option>
              </>
            ) : (
              <>
                <option value={0}>No Target</option>
                <option value={8}>Benched Ally</option>
                <option value={9}>Any Ally</option>
                <option value={4}>Fielded Opponent</option>
                <option value={5}>Fielded Beastie (except user)</option>
                <option value={6}>Fielded Beastie</option>
                <option value={7}>
                  Fielded Ally + Fielded Opponent (at net)
                </option>
              </>
            )}
          </select>
        </label>
        <div>
          Learned By:{" "}
          <BeastieSelect
            beastieId={undefined}
            setBeastieId={(beastie) => {
              if (!beastie) return;
              console.log(play.learnedby);
              setKey(
                "learnedby",
                play.learnedby.includes(beastie)
                  ? play.learnedby.filter((b) => b != beastie)
                  : [...play.learnedby, beastie],
              );
            }}
            hashName="LearnedBy"
            textOverride="Add Beastie"
          />
          {play.learnedby.map((beastie) => (
            <span>
              {L(BEASTIE_DATA.get(beastie)?.name ?? beastie)}{" "}
              <button
                onClick={() =>
                  setKey(
                    "learnedby",
                    play.learnedby.filter((b) => b != beastie),
                  )
                }
              >
                X
              </button>
            </span>
          ))}
        </div>
        <div>Effects:</div>
        {play.effects.map((eff, index) => (
          <EffectSelect
            key={index}
            effect={eff}
            setEffect={(effect) => {
              const callback = EFFECT_INFO[effect.eff]?.effChangeCallback;
              if (callback) {
                effect = callback(effect);
              } else if (typeof effect.pow == "string") {
                effect.pow = 0;
              }
              play.effects[index] = effect;
              setKey("effects", play.effects);
            }}
            deleteEffect={() => {
              play.effects.splice(index, 1);
              setKey("effects", play.effects);
            }}
            moveEffect={(dir) => {
              const eff2 = play.effects[index + dir];
              play.effects[index + dir] = eff;
              play.effects[index] = eff2;
              setKey("effects", play.effects);
            }}
            first={index == 0}
            last={index == play.effects.length - 1}
          />
        ))}
        <EffectSelect
          setEffect={(effect) => {
            const callback = EFFECT_INFO[effect.eff]?.effChangeCallback;
            if (callback) {
              effect = callback(effect);
            } else if (typeof effect.pow == "string") {
              effect.pow = 0;
            }
            setKey("effects", [...play.effects, effect]);
          }}
        />
        <button onClick={deletePlay}>Delete Play</button>
      </div>
      <MoveView
        move={{
          id: String(idAccum),
          name: play.name,
          type: play.type,
          use: play.use,
          targ: play.target,
          pow: play.pow,
          eff: play.effects,

          desc_tags: [],
          desc_tagids: [],
          description: null,
          bt_tags: [],
          price: 0,
        }}
      />
    </>
  );
}
