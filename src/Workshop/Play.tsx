import { useState } from "react";
import MoveView from "../shared/MoveView";
import { WorkshopPlay } from "./types";
import { StringDataInput } from "./Workshop";
import { MoveEffect, MoveEffectType } from "../data/MoveData";
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
      style={{ flexGrow: "1" }}
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
      <option value={8}>Jazzed</option>
      <option value={9}>Blocked</option>
      <option value={10}>Tired</option>
      <option value={11}>Tender</option>
      <option value={12}>Stressed</option>
      <option value={13}>Weepy</option>
      <option value={7}>Aware (Unused)</option>
    </select>
  ),
};

const EFFECT_INFO: Partial<Record<MoveEffectType, EffectInfo>> = {
  [MoveEffectType.DamageAdjust]: {
    // Damage Adjust
    targetSelector: () => null,
    powSelector: ({ pow, setPow }) => (
      <DamageAdjustInput
        pow={typeof pow == "number" ? pow : 0}
        setPow={setPow}
      />
    ),
  },
  [MoveEffectType.TraitSet]: {
    powSelector: ({ pow, setPow }) => (
      <AbilityInput
        pow={typeof pow == "string" ? pow : "haunted"}
        setPow={setPow}
      />
    ),
    effChangeCallback: (effect) => ({
      eff: MoveEffectType.TraitSet,
      targ: effect.targ,
      pow:
        typeof effect.pow == "string" && abilities[effect.pow]
          ? effect.pow
          : "haunted",
    }),
  },
  [MoveEffectType.FieldTrap]: DEFAULT_FIELD_TARGET,
  [MoveEffectType.FieldRally]: DEFAULT_FIELD_TARGET,
  [MoveEffectType.FieldRhythm]: DEFAULT_FIELD_TARGET,
  [MoveEffectType.FieldDread]: DEFAULT_FIELD_TARGET,
  [MoveEffectType.FieldQuake]: DEFAULT_FIELD_TARGET,
  [MoveEffectType.FieldClear]: DEFAULT_FIELD_TARGET,

  [MoveEffectType.CanHitWithoutVolley]: NO_SELECTORS,
  [MoveEffectType.GivesEasyRecieve]: NO_SELECTORS,
  [MoveEffectType.UseWhenPreventFeeling]: NO_SELECTORS,
  [MoveEffectType.VolleyOnRecieve]: NO_SELECTORS,
  [MoveEffectType.NoRedirect]: NO_SELECTORS,
  [MoveEffectType.Mimic]: NO_SELECTORS,
  [MoveEffectType.PowMultiply]: { targetSelector: () => {}, step: 0.1 },
  [MoveEffectType.IgnoresTrait]: NO_SELECTORS,

  [MoveEffectType.AddActions]: { targetSelector: () => {} },
  [MoveEffectType.Charge]: { targetSelector: () => {} },
  [MoveEffectType.ChargeReset]: NO_SELECTORS,

  [MoveEffectType.Requires2Actions]: NO_SELECTORS,
  [MoveEffectType.Requires3Actions]: NO_SELECTORS,
  [MoveEffectType.PreventObstructed]: NO_SELECTORS,
  [MoveEffectType.CanUseDefense]: NO_SELECTORS,
  [MoveEffectType.RequiredVolleyState]: {
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

  [MoveEffectType.IfField]: FIELD_SELECTOR,

  [MoveEffectType.FeelingCure]: FEELING_SELECTOR,
  [MoveEffectType.IfFeeling]: FEELING_SELECTOR,

  [MoveEffectType.StaminaChange]: { step: 0.01 },
};

const HAS_NEGATIVE = [
  MoveEffectType.FeelNervous,
  MoveEffectType.FeelAngry,
  MoveEffectType.FeelShook,
  MoveEffectType.FeelNoisy,
  MoveEffectType.FeelTough,
  MoveEffectType.FeelWiped,
  MoveEffectType.FeelSweaty,
  MoveEffectType.FeelJazzed,
  MoveEffectType.FeelBlocked,
  MoveEffectType.FeelTired,
  MoveEffectType.FeelTender,
  MoveEffectType.FeelStressed,
  MoveEffectType.FeelWeepy,
];

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

  const hasNegative = HAS_NEGATIVE.includes(Math.abs(effect?.eff ?? 0));

  return (
    <div style={{ display: "flex" }}>
      {/* prettier-ignore */}
      <select
        value={effect ? hasNegative ? Math.abs(effect.eff) : effect.eff : -9999}
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
          <option value={MoveEffectType.BodyPowChange}>Body POW Change</option>
          <option value={MoveEffectType.SpiritPowChange}>Spirit POW Change</option>
          <option value={MoveEffectType.MindPowChange}>Mind POW Change</option>
          <option value={MoveEffectType.BodyDefChange}>Body DEF Change</option>
          <option value={MoveEffectType.SpiritDefChange}>Spirit DEF Change</option>
          <option value={MoveEffectType.MindDefChange}>Mind DEF Change</option>
          <option value={MoveEffectType.BodyMindPowChange}>Body + Spirit POW Change</option>
          <option value={MoveEffectType.BodySpiritPowChange}>Body + Mind POW Change</option>
          <option value={MoveEffectType.SpiritMindPowChange}>Spirit + Mind POW Change</option>
          <option value={MoveEffectType.BodyMindDefChange}>Body + Spirit DEF Change</option>
          <option value={MoveEffectType.BodySpiritDefChange}>Body + Mind DEF Change</option>
          <option value={MoveEffectType.SpiritMindDefChange}>Spirit + Mind DEF Change</option>
          <option value={MoveEffectType.AllPowChange}>All POW Change</option>
          <option value={MoveEffectType.AllDefChange}>All DEF Change</option>
          <option value={MoveEffectType.WeakDefChange}>Weakest DEF Change</option>
          <option value={MoveEffectType.TransferBoosts}>Transfer Boosts to Target</option>
          <option value={MoveEffectType.ResetBoosts}>Reset Boosts</option>
        </optgroup>
        <optgroup label="Feelings">
          <option value={MoveEffectType.FeelNervous}>Feel NERVOUS</option>
          <option value={MoveEffectType.FeelAngry}>Feel ANGRY</option>
          <option value={MoveEffectType.FeelShook}>Feel SHOOK</option>
          <option value={MoveEffectType.FeelNoisy}>Feel NOISY</option>
          <option value={MoveEffectType.FeelTough}>Feel TOUGH</option>
          <option value={MoveEffectType.FeelWiped}>Feel WIPED</option>
          <option value={MoveEffectType.FeelSweaty}>Feel SWEATY</option>
          <option value={MoveEffectType.FeelJazzed}>Feel JAZZED</option>
          <option value={MoveEffectType.FeelBlocked}>Feel BLOCKED</option>
          <option value={MoveEffectType.FeelTired}>Feel TIRED</option>
          <option value={MoveEffectType.FeelTender}>Feel TENDER</option>
          <option value={MoveEffectType.FeelStressed}>Feel STRESSED</option>
          <option value={MoveEffectType.FeelWeepy}>Feel WEEPY</option>
          <option value={MoveEffectType.FeelingCombiner}>Combine Feelings</option>
          <option value={MoveEffectType.FeelingCure}>Cure a Single Feeling</option>
          <option value={MoveEffectType.FeelingBadCure}>Cure Bad Feelings (except ANGRY)</option>
          <option value={MoveEffectType.FeelingAllCure}>Cure All Feelings (except ANGRY)</option>
          <option value={MoveEffectType.FeelingAllCureAngry}>Cure All Feelings (including ANGRY)</option>
        </optgroup>
        <optgroup label="Field">
          <option value={MoveEffectType.FieldTrap}>TRAP</option>
          <option value={MoveEffectType.FieldRally}>RALLY</option>
          <option value={MoveEffectType.FieldRhythm}>RHYTHM</option>
          <option value={MoveEffectType.FieldDread}>DREAD</option>
          <option value={MoveEffectType.FieldQuake}>QUAKE</option>
          <option value={MoveEffectType.FieldBarrier}>BARRIER</option>
          <option value={MoveEffectType.FieldClear}>Clear Field</option>
        </optgroup>
        <optgroup label="Stamina">
          <option value={MoveEffectType.StaminaChange}>STAMINA Heal/Damage</option>
          <option value={MoveEffectType.MaxStaminaChange}>Max Stamina</option>
          <option value={MoveEffectType.FullRestore}>Fully Restore</option>
          <option value={MoveEffectType.StaminaSplit}>Evenly Shares Stamina with Target</option>
        </optgroup>
        <optgroup label="Move">
          <option value={MoveEffectType.Shift}>SHIFT</option>
          <option value={MoveEffectType.ShiftBeforeHit}>SHIFT before hit</option>
          <option value={MoveEffectType.Swap}>Swap With Ally</option>
          <option value={MoveEffectType.SwapNoBall}>Swap With Ally without moving Ball</option>
          <option value={MoveEffectType.TagOut}>TAG OUT</option>
          <option value={MoveEffectType.TagOutBeforeHit}>TAG OUT self (attack)</option>
        </optgroup>
        <optgroup label="Trait">
          <option value={MoveEffectType.TraitSwap}>Trait Swap</option>
          <option value={MoveEffectType.TraitCopy}>User's Trait becomes Target's</option>
          <option value={MoveEffectType.TraitGive}>Target's Trait becomes User's</option>
          <option value={MoveEffectType.TraitSet}>Trait Set</option>
        </optgroup>
        <optgroup label="Attack">
          <option value={MoveEffectType.DamageAdjust}>Damage Adjust</option>
          <option value={MoveEffectType.CanHitWithoutVolley}>Can use without Volleying</option>
          <option value={MoveEffectType.GivesEasyRecieve}>Gives an Easy Recieve</option>
          <option value={MoveEffectType.VolleyOnRecieve}>Automatically Volleys on recieve</option>
          <option value={MoveEffectType.NoRedirect}>Can't be redirected</option>
          <option value={MoveEffectType.UseWhenPreventFeeling}>Can use when TIRED, SHOOK or WIPED</option>
          <option value={MoveEffectType.IgnoresTrait}>Ignores Target's Trait</option>
          <option value={MoveEffectType.Mimic}>Mimic ally's first Attack</option>
          <option value={MoveEffectType.PowMultiply}>POW Multiply</option>
        </optgroup>
        <optgroup label="Usage">
          <option value={MoveEffectType.Pass}>Pass/Volley</option>
          <option value={MoveEffectType.Charge}>Charges Up</option>
          <option value={MoveEffectType.ChargeReset}>Charge Resets on Use</option>
          <option value={MoveEffectType.AddActions}>+/- ACTIONs</option>
          <option value={MoveEffectType.Requires2Actions}>Requires 2 ACTIONs</option>
          <option value={MoveEffectType.Requires3Actions}>Requires 3 ACTIONs</option>
          <option value={MoveEffectType.PreventObstructed}>Can't use if space is obstructed</option>
          <option value={MoveEffectType.CanUseDefense}>Can be used during Defense</option>
          <option value={MoveEffectType.RequiredVolleyState}>Can only be used if ball is/isn't Volleyed</option>
        </optgroup>
        <optgroup label="Effect Condition">
          <option value={MoveEffectType.IfHittable}>If ball is hittable</option>
          <option value={MoveEffectType.IfSuccess}>If previous effect succeeded</option>
          <option value={MoveEffectType.IfBlock}>If ally can Block</option>
          <option value={MoveEffectType.IfField}>If FIELD EFFECT</option>
          <option value={MoveEffectType.IfStamina}>If target STAMINA greater</option>
          <option value={MoveEffectType.IfFeeling}>If target feels</option>
        </optgroup>
        <optgroup label="Unused (Not Recommended)">
          <option value={MoveEffectType.FeelAware}>Feel AWARE</option>
          <option value={MoveEffectType.AdditionalPercent}>Additional Damage %</option>
        </optgroup>
      </select>
      {effect && moveEffect && deleteEffect && (
        <>
          {hasNegative ? (
            <select
              value={effect.eff > 0 ? 1 : -1}
              onChange={(event) =>
                setEffect({
                  ...effect,
                  eff: Math.abs(effect.eff) * Number(event.currentTarget.value),
                })
              }
            >
              <option value={1}>After Hit</option>
              <option value={-1}>Before Hit</option>
            </select>
          ) : undefined}
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
          <div style={{ flex: "1 1 0" }}></div>
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
        <div style={{ display: "flex", flexDirection: "column" }}>
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
        </div>
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
        noLearner={true}
      />
    </>
  );
}
