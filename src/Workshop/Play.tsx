import { useState } from "react";
import MoveView from "../shared/MoveView";
import { WorkshopPlay } from "./types";
import { StringDataInput } from "./Workshop";
import { MoveEffect, MoveEffectType } from "../data/MoveData";
import abilities from "../data/abilities";
import useLocalization from "../localization/useLocalization";
import BeastieSelect from "../shared/BeastieSelect";
import BEASTIE_DATA from "../data/BeastieData";
import CustomErrorBoundary from "../shared/CustomErrorBoundary";

type EffectInfo = {
  id: MoveEffectType;
  title: string;
  header?: string;
  targetSelector?: (props: {
    target: number;
    setTarget: (target: number) => void;
    effectInfo: TemplateEffectInfo;
  }) => React.ReactNode;
  powSelector?: (props: {
    pow: number | string;
    setPow: (pow: number | string) => void;
    effectInfo: TemplateEffectInfo;
  }) => React.ReactNode;
  effChangeCallback?: (effect: MoveEffect) => MoveEffect;
  min?: number;
  max?: number;
  step?: number;
  hasNegative?: boolean;
};

type TemplateEffectInfo = Omit<EffectInfo, "id" | "title" | "header">;

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

function ShiftInput({
  pow,
  setPow,
}: {
  pow: string | number;
  setPow: (pow: string | number) => void;
}) {
  return (
    <select
      value={pow}
      onChange={(event) => setPow(Number(event.currentTarget.value))}
    >
      <option value={0}>Backward</option>
      <option value={1}>Forward</option>
      <option value={2}>Opposite Lane</option>
      <option value={3}>Opposite Row</option>
    </select>
  );
}

const DEFAULT_EFFECT_INFO: TemplateEffectInfo &
  Required<Pick<TemplateEffectInfo, "targetSelector" | "powSelector">> = {
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

const DEFAULT_FIELD_TARGET: TemplateEffectInfo = {
  targetSelector: ({ target, setTarget }) => (
    <select
      onChange={(event) => setTarget(Number(event.target.value))}
      value={target}
    >
      <option value={0}>Ally Field</option>
      <option value={3}>Opponent Field</option>
      <option value={7}>Entire Field</option>
      <option value={12}>Either Field</option>
    </select>
  ),
};

const NO_SELECTORS: TemplateEffectInfo = {
  targetSelector: () => {},
  powSelector: () => {},
};

const FIELD_SELECTOR: TemplateEffectInfo = {
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

const FEELING_SELECTOR: TemplateEffectInfo = {
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

const EFFECT_INFO: EffectInfo[] = [
  {
    id: MoveEffectType.BodyPowChange,
    title: "Body POW Change",
    header: "Boosts",
  },
  { id: MoveEffectType.SpiritPowChange, title: "Spirit POW Change" },
  { id: MoveEffectType.MindPowChange, title: "Mind POW Change" },
  { id: MoveEffectType.BodyDefChange, title: "Body DEF Change" },
  { id: MoveEffectType.SpiritDefChange, title: "Spirit DEF Change" },
  { id: MoveEffectType.MindDefChange, title: "Mind DEF Change" },
  { id: MoveEffectType.BodyMindPowChange, title: "Body + Spirit POW Change" },
  { id: MoveEffectType.BodySpiritPowChange, title: "Body + Mind POW Change" },
  { id: MoveEffectType.SpiritMindPowChange, title: "Spirit + Mind POW Change" },
  { id: MoveEffectType.BodyMindDefChange, title: "Body + Spirit DEF Change" },
  { id: MoveEffectType.BodySpiritDefChange, title: "Body + Mind DEF Change" },
  { id: MoveEffectType.SpiritMindDefChange, title: "Spirit + Mind DEF Change" },
  { id: MoveEffectType.AllPowChange, title: "All POW Change" },
  { id: MoveEffectType.AllDefChange, title: "All DEF Change" },
  { id: MoveEffectType.WeakDefChange, title: "Weakest DEF Change" },
  { id: MoveEffectType.TransferBoosts, title: "Transfer Boosts to Target" },
  { id: MoveEffectType.ResetBoosts, title: "Reset Boosts" },
  {
    id: MoveEffectType.FeelNervous,
    title: "Feel NERVOUS",
    header: "Feelings",
    hasNegative: true,
  },
  { id: MoveEffectType.FeelAngry, title: "Feel ANGRY", hasNegative: true },
  { id: MoveEffectType.FeelShook, title: "Feel SHOOK", hasNegative: true },
  { id: MoveEffectType.FeelNoisy, title: "Feel NOISY", hasNegative: true },
  { id: MoveEffectType.FeelTough, title: "Feel TOUGH", hasNegative: true },
  { id: MoveEffectType.FeelWiped, title: "Feel WIPED", hasNegative: true },
  { id: MoveEffectType.FeelSweaty, title: "Feel SWEATY", hasNegative: true },
  { id: MoveEffectType.FeelJazzed, title: "Feel JAZZED", hasNegative: true },
  { id: MoveEffectType.FeelBlocked, title: "Feel BLOCKED", hasNegative: true },
  { id: MoveEffectType.FeelTired, title: "Feel TIRED", hasNegative: true },
  { id: MoveEffectType.FeelTender, title: "Feel TENDER", hasNegative: true },
  {
    id: MoveEffectType.FeelStressed,
    title: "Feel STRESSED",
    hasNegative: true,
  },
  { id: MoveEffectType.FeelWeepy, title: "Feel WEEPY", hasNegative: true },
  { id: MoveEffectType.FeelingCombiner, title: "Combine Feelings" },
  {
    id: MoveEffectType.FeelingCure,
    title: "Cure a Single Feeling",
    ...FEELING_SELECTOR,
  },
  {
    id: MoveEffectType.FeelingBadCure,
    title: "Cure Bad Feelings (except ANGRY)",
  },
  {
    id: MoveEffectType.FeelingAllCure,
    title: "Cure All Feelings (except ANGRY)",
  },
  {
    id: MoveEffectType.FeelingAllCureAngry,
    title: "Cure All Feelings (including ANGRY)",
  },
  {
    id: MoveEffectType.FieldTrap,
    title: "TRAP",
    header: "Field",
    ...DEFAULT_FIELD_TARGET,
  },
  { id: MoveEffectType.FieldRally, title: "RALLY", ...DEFAULT_FIELD_TARGET },
  { id: MoveEffectType.FieldRhythm, title: "RHYTHM", ...DEFAULT_FIELD_TARGET },
  { id: MoveEffectType.FieldDread, title: "DREAD", ...DEFAULT_FIELD_TARGET },
  { id: MoveEffectType.FieldQuake, title: "QUAKE", ...DEFAULT_FIELD_TARGET },
  {
    id: MoveEffectType.FieldBarrier,
    title: "BARRIER",
    ...DEFAULT_FIELD_TARGET,
  },
  {
    id: MoveEffectType.FieldClear,
    title: "Clear Field",
    ...DEFAULT_FIELD_TARGET,
  },
  {
    id: MoveEffectType.StaminaChange,
    title: "STAMINA Heal/Damage",
    header: "Stamina",
    step: 0.01,
  },
  { id: MoveEffectType.MaxStaminaChange, title: "Max Stamina" },
  { id: MoveEffectType.FullRestore, title: "Fully Restore" },
  {
    id: MoveEffectType.StaminaSplit,
    title: "Evenly Shares Stamina with Target",
  },
  {
    id: MoveEffectType.Shift,
    title: "SHIFT",
    header: "Move",
    powSelector: ShiftInput,
  },
  {
    id: MoveEffectType.ShiftBeforeHit,
    title: "SHIFT before hit",
    powSelector: ShiftInput,
  },
  { id: MoveEffectType.Swap, title: "Swap With Ally" },
  {
    id: MoveEffectType.SwapNoBall,
    title: "Swap With Ally without moving Ball",
  },
  { id: MoveEffectType.TagOut, title: "TAG OUT" },
  { id: MoveEffectType.TagOutBeforeHit, title: "TAG OUT self (attack)" },
  { id: MoveEffectType.TraitSwap, title: "Trait Swap", header: "Trait" },
  { id: MoveEffectType.TraitCopy, title: "User's Trait becomes Target's" },
  { id: MoveEffectType.TraitGive, title: "Target's Trait becomes User's" },
  {
    id: MoveEffectType.TraitSet,
    title: "Trait Set",
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
  {
    id: MoveEffectType.DamageAdjust,
    title: "Damage Adjust",
    header: "Attack",
    targetSelector: () => null,
    powSelector: ({ pow, setPow }) => (
      <DamageAdjustInput
        pow={typeof pow == "number" ? pow : 0}
        setPow={setPow}
      />
    ),
  },
  {
    id: MoveEffectType.CanHitWithoutVolley,
    title: "Can use without Volleying",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.GivesEasyRecieve,
    title: "Gives an Easy Recieve",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.VolleyOnRecieve,
    title: "Automatically Volleys on recieve",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.NoRedirect,
    title: "Can't be redirected",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.UseWhenPreventFeeling,
    title: "Can use when TIRED, SHOOK or WIPED",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.IgnoresTrait,
    title: "Ignores Target's Trait",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.Mimic,
    title: "Mimic ally's first Attack",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.PowMultiply,
    title: "POW Multiply",
    targetSelector: () => {},
    step: 0.1,
  },
  { id: MoveEffectType.Pass, title: "Pass/Volley", header: "Usage" },
  { id: MoveEffectType.Charge, title: "Charges Up", targetSelector: () => {} },
  {
    id: MoveEffectType.ChargeReset,
    title: "Charge Resets on Use",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.AddActions,
    title: "+/- ACTIONs",
    targetSelector: () => {},
  },
  {
    id: MoveEffectType.Requires2Actions,
    title: "Requires 2 ACTIONs",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.Requires3Actions,
    title: "Requires 3 ACTIONs",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.PreventObstructed,
    title: "Can't use if space is obstructed",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.CanUseDefense,
    title: "Can be used during Defense",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.RequiredVolleyState,
    title: "Can only be used if ball is/isn't Volleyed",
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
  {
    id: MoveEffectType.IfHittable,
    title: "If ball is hittable",
    header: "Effect Condition",
  },
  { id: MoveEffectType.IfSuccess, title: "If previous effect succeeded" },
  { id: MoveEffectType.IfBlock, title: "If ally can Block" },
  { id: MoveEffectType.IfField, title: "If FIELD EFFECT", ...FIELD_SELECTOR },
  { id: MoveEffectType.IfStamina, title: "If target STAMINA greater" },
  {
    id: MoveEffectType.IfFeeling,
    title: "If target feels",
    ...FEELING_SELECTOR,
  },
  {
    id: MoveEffectType.FeelAware,
    title: "Feel AWARE",
    header: "Unused (Not Recommended)",
  },
  { id: MoveEffectType.AdditionalPercent, title: "Additional Damage %" },
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
  const effType = effect?.eff ?? 0;
  const effectInfo =
    EFFECT_INFO.find((info) => info.id == effType) ??
    EFFECT_INFO.find((info) => info.id == Math.abs(effType)) ??
    DEFAULT_EFFECT_INFO;

  const TargetSelector =
    effectInfo.targetSelector ?? DEFAULT_EFFECT_INFO.targetSelector;
  const PowSelector = effectInfo.powSelector ?? DEFAULT_EFFECT_INFO.powSelector;

  const options = [];
  let header = "";
  let headerOptions: React.ReactElement[] = [];
  for (const effect of EFFECT_INFO) {
    if (effect.header) {
      if (headerOptions.length) {
        options.push(
          <optgroup key={header} label={header}>
            {headerOptions}
          </optgroup>,
        );
        headerOptions = [];
      }
      header = effect.header;
    }
    headerOptions.push(
      <option key={effect.id} value={effect.id}>
        {effect.title}
      </option>,
    );
  }
  if (headerOptions.length) {
    options.push(<optgroup label={header}>{headerOptions}</optgroup>);
  }

  return (
    <div style={{ display: "flex" }}>
      {/* prettier-ignore */}
      <select
        value={effect ? effectInfo.hasNegative ? Math.abs(effect.eff) : effect.eff : -9999}
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
        {options}
      </select>
      {effect && moveEffect && deleteEffect && (
        <>
          {effectInfo.hasNegative ? (
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
                const callback = EFFECT_INFO.find(
                  (info) => info.id == effect.eff,
                )?.effChangeCallback;
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
              const callback = EFFECT_INFO.find(
                (info) => info.id == effect.eff,
              )?.effChangeCallback;
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
      <CustomErrorBoundary fallbackClassName="">
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
      </CustomErrorBoundary>
    </>
  );
}
