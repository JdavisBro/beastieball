import { useEffect, useRef, useState } from "react";
import MoveView from "../shared/MoveView";
import { WorkshopPlay } from "./types";
import { StringDataInput } from "./Workshop";
import { MoveEffect, MoveEffectType } from "../data/MoveData";
import abilities from "../data/abilities";
import useLocalization from "../localization/useLocalization";
import BeastieSelect from "../shared/BeastieSelect";
import BEASTIE_DATA from "../data/BeastieData";
import CustomErrorBoundary from "../shared/CustomErrorBoundary";

function useAutoApply(setValue: (value: number) => void) {
  const ref = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    if (ref.current && isNaN(Number(ref.current.value)))
      setValue(Number(ref.current.value));
  }, []);
  return ref;
}

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
  const { L } = useLocalization();

  return (
    <select
      onChange={(event) => setPow(Number(event.currentTarget.value))}
      value={pow}
      ref={useAutoApply(setPow)}
    >
      <option value={0}>{L("workshop.play.damageAdjust.addStamina")}</option>
      <option value={1}>
        {L("workshop.play.damageAdjust.userLowerStamina")}
      </option>
      <option value={2}>{L("workshop.play.damageAdjust.bodyDef")}</option>
      <option value={3}>{L("workshop.play.damageAdjust.spiritDef")}</option>
      <option value={4}>{L("workshop.play.damageAdjust.mindDef")}</option>
      <option value={5}>
        {L("workshop.play.damageAdjust.targetTaggedIn")}
      </option>
      <option value={6}>{L("workshop.play.damageAdjust.targetMoved")}</option>
      <option value={7}>{L("workshop.play.damageAdjust.serve")}</option>
      <option value={8}>
        {L("workshop.play.damageAdjust.targetMoreStamina")}
      </option>
      <option value={9}>
        {L("workshop.play.damageAdjust.targetLowStamina")}
      </option>
      <option value={10}>{L("workshop.play.damageAdjust.userBoost")}</option>
      <option value={11}>{L("workshop.play.damageAdjust.targetBoost")}</option>
      <option value={12}>
        {L("workshop.play.damageAdjust.userBadFeeling")}
      </option>
      <option value={13}>
        {L("workshop.play.damageAdjust.targetBadFeeling")}
      </option>
      <option value={14}>
        {L("workshop.play.damageAdjust.ignoreShields")}
      </option>
      <option value={15}>{L("workshop.play.damageAdjust.scoreBehind")}</option>
      <option value={16}>{L("workshop.play.damageAdjust.backRow")}</option>
      <option value={17}>
        {L("workshop.play.damageAdjust.ignoresBlocked")}
      </option>
      <option value={18}>{L("workshop.play.damageAdjust.userRecieved")}</option>
      <option value={19}>{L("workshop.play.damageAdjust.volleys")}</option>
      <option value={20}>{L("workshop.play.damageAdjust.userTaggedIn")}</option>
      <option value={21}>
        {L("workshop.play.damageAdjust.targetDownBoost")}
      </option>
      <option value={22}>
        {L("workshop.play.damageAdjust.targetWeakestDef")}
      </option>
      <option value={23}>
        {L("workshop.play.damageAdjust.targetStrongestDef")}
      </option>
      <option value={24}>
        {L("workshop.play.damageAdjust.userDownBoost")}
      </option>
      <option value={25}>{L("workshop.play.damageAdjust.rally")}</option>
      <option value={26}>{L("workshop.play.damageAdjust.userMoved")}</option>
      <option value={27}>
        {L("workshop.play.damageAdjust.userLowStamina")}
      </option>
      <option value={28}>
        {L("workshop.play.damageAdjust.ignoresUserBoosts")}
      </option>
      <option value={29}>{L("workshop.play.damageAdjust.fieldEffects")}</option>
      <option value={30}>{L("workshop.play.damageAdjust.actions")}</option>
      <option value={31}>{L("workshop.play.damageAdjust.jazzed")}</option>
      <option value={32}>{L("workshop.play.damageAdjust.feelings")}</option>
      <option value={33}>{L("workshop.play.damageAdjust.ignoresRally")}</option>
      <option value={34}>{L("workshop.play.damageAdjust.sweaty")}</option>
      <option value={35}>{L("workshop.play.damageAdjust.fromBackRow")}</option>
      <option value={36}>{L("workshop.play.damageAdjust.fromFrontRow")}</option>
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
  const { L } = useLocalization();

  return (
    <select
      value={pow}
      onChange={(event) => setPow(Number(event.currentTarget.value))}
      ref={useAutoApply(setPow)}
    >
      <option value={0}>{L("workshop.play.shift.backward")}</option>
      <option value={1}>{L("workshop.play.shift.forward")}</option>
      <option value={2}>{L("workshop.play.shift.oppositeLane")}</option>
      <option value={3}>{L("workshop.play.shift.oppositeRow")}</option>
    </select>
  );
}

const DEFAULT_EFFECT_INFO: TemplateEffectInfo &
  Required<Pick<TemplateEffectInfo, "targetSelector" | "powSelector">> = {
  targetSelector: ({ target, setTarget }) => {
    const { L } = useLocalization();
    return (
      <select
        onChange={(event) => setTarget(Number(event.target.value))}
        value={target}
        ref={useAutoApply(setTarget)}
      >
        <option value={0}>{L("workshop.play.effectTarget.user")}</option>
        <option value={1}>{L("workshop.play.effectTarget.ally")}</option>
        <option value={2}>{L("workshop.play.effectTarget.activeTeam")}</option>
        <option value={3}>{L("workshop.play.effectTarget.target")}</option>
        <option value={4}>{L("workshop.play.effectTarget.targetTeam")}</option>
        <option value={5}>{L("workshop.play.effectTarget.targetAlly")}</option>
        <option value={6}>{L("workshop.play.effectTarget.entireTeam")}</option>
        <option value={7}>
          {L("workshop.play.effectTarget.everyFieldedPlayer")}
        </option>
        <option value={8}>{L("workshop.play.effectTarget.otherTeam")}</option>
        <option value={9}>
          {L("workshop.play.effectTarget.nearestEnemy")}
        </option>
        <option value={10}>
          {L("workshop.play.effectTarget.frontRowActiveTeam")}
        </option>
        <option value={11}>{L("workshop.play.effectTarget.activeTeam")}</option>
        <option value={12}>
          {L("workshop.play.effectTarget.userAndTarget")}
        </option>
      </select>
    );
  },
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
  targetSelector: ({ target, setTarget }) => {
    const { L } = useLocalization();
    return (
      <select
        onChange={(event) => setTarget(Number(event.target.value))}
        value={target}
        ref={useAutoApply(setTarget)}
      >
        <option value={0}> {L("workshop.play.field.ally")}</option>
        <option value={3}> {L("workshop.play.field.opponent")}</option>
        <option value={7}> {L("workshop.play.field.entire")}</option>
        <option value={12}>{L("workshop.play.field.either")}</option>
      </select>
    );
  },
};

const NO_SELECTORS: TemplateEffectInfo = {
  targetSelector: () => {},
  powSelector: () => {},
};

const FIELD_SELECTOR: TemplateEffectInfo = {
  targetSelector: DEFAULT_FIELD_TARGET.targetSelector,
  powSelector: ({ pow, setPow }) => {
    const { L } = useLocalization();
    return (
      <select
        value={pow}
        onChange={(event) => setPow(Number(event.currentTarget.value))}
        ref={useAutoApply(setPow)}
      >
        <option value={0}>{L("fieldeffectstuff_001")}</option>
        <option value={1}>{L("fieldeffectstuff_002")}</option>
        <option value={2}>{L("fieldeffectstuff_003")}</option>
        <option value={3}>{L("fieldeffectstuff_004")}</option>
        <option value={5}>{L("fieldeffectstuff_005")}</option>
      </select>
    );
  },
};

const FEELING_SELECTOR: TemplateEffectInfo = {
  powSelector: ({ pow, setPow }) => {
    const { L } = useLocalization();
    return (
      <select
        value={pow}
        onChange={(event) => setPow(Number(event.currentTarget.value))}
        ref={useAutoApply(setPow)}
      >
        <option value={0}>{L("statuseffectstuff_001")}</option>
        <option value={1}>{L("statuseffectstuff_002")}</option>
        <option value={2}>{L("statuseffectstuff_003")}</option>
        <option value={3}>{L("statuseffectstuff_004")}</option>
        <option value={4}>{L("statuseffectstuff_005")}</option>
        <option value={5}>{L("statuseffectstuff_006")}</option>
        <option value={6}>{L("statuseffectstuff_007")}</option>
        <option value={8}>{L("statuseffectstuff_009")}</option>
        <option value={9}>{L("statuseffectstuff_010")}</option>
        <option value={10}>{L("statuseffectstuff_011")}</option>
        <option value={11}>{L("statuseffectstuff_012")}</option>
        <option value={12}>{L("statuseffectstuff_013")}</option>
        <option value={13}>{L("statuseffectstuff_029")}</option>
        <option value={7}>{L("workshop.play.aware")}</option>
      </select>
    );
  },
};

const EFFECT_INFO: EffectInfo[] = [
  {
    id: MoveEffectType.BodyPowChange,
    title: "BodyPowChange",
    header: "Boosts",
  },
  { id: MoveEffectType.SpiritPowChange, title: "SpiritPowChange" },
  { id: MoveEffectType.MindPowChange, title: "MindPowChange" },
  { id: MoveEffectType.BodyDefChange, title: "BodyDefChange" },
  { id: MoveEffectType.SpiritDefChange, title: "SpiritDefChange" },
  { id: MoveEffectType.MindDefChange, title: "MindDefChange" },
  { id: MoveEffectType.BodyMindPowChange, title: "BodyMindPowChange" },
  { id: MoveEffectType.BodySpiritPowChange, title: "BodySpiritPowChange" },
  { id: MoveEffectType.SpiritMindPowChange, title: "SpiritMindPowChange" },
  { id: MoveEffectType.BodyMindDefChange, title: "BodyMindDefChange" },
  { id: MoveEffectType.BodySpiritDefChange, title: "BodySpiritDefChange" },
  { id: MoveEffectType.SpiritMindDefChange, title: "SpiritMindDefChange" },
  { id: MoveEffectType.AllPowChange, title: "AllPowChange" },
  { id: MoveEffectType.AllDefChange, title: "AllDefChange" },
  { id: MoveEffectType.WeakDefChange, title: "WeakDefChange" },
  {
    id: MoveEffectType.TransferBoosts,
    title: "TransferBoosts",
    powSelector: () => {},
  },
  {
    id: MoveEffectType.ResetBoosts,
    title: "ResetBoosts",
    powSelector: () => {},
  },
  {
    id: MoveEffectType.FeelNervous,
    title: "FeelNervous",
    header: "Feelings",
    hasNegative: true,
  },
  { id: MoveEffectType.FeelAngry, title: "FeelAngry", hasNegative: true },
  { id: MoveEffectType.FeelShook, title: "FeelShook", hasNegative: true },
  { id: MoveEffectType.FeelNoisy, title: "FeelNoisy", hasNegative: true },
  { id: MoveEffectType.FeelTough, title: "FeelTough", hasNegative: true },
  { id: MoveEffectType.FeelWiped, title: "FeelWiped", hasNegative: true },
  { id: MoveEffectType.FeelSweaty, title: "FeelSweaty", hasNegative: true },
  { id: MoveEffectType.FeelJazzed, title: "FeelJazzed", hasNegative: true },
  { id: MoveEffectType.FeelBlocked, title: "FeelBlocked", hasNegative: true },
  { id: MoveEffectType.FeelTired, title: "FeelTired", hasNegative: true },
  { id: MoveEffectType.FeelTender, title: "FeelTender", hasNegative: true },
  {
    id: MoveEffectType.FeelStressed,
    title: "FeelStressed",
    hasNegative: true,
  },
  { id: MoveEffectType.FeelWeepy, title: "FeelWeepy", hasNegative: true },
  {
    id: MoveEffectType.FeelingCombiner,
    title: "FeelingCombiner",
    powSelector: () => {},
  },
  {
    id: MoveEffectType.FeelingCure,
    title: "FeelingCure",
    ...FEELING_SELECTOR,
  },
  {
    id: MoveEffectType.FeelingBadCure,
    title: "FeelingBadCure",
    powSelector: () => {},
  },
  {
    id: MoveEffectType.FeelingAllCure,
    title: "FeelingAllCure",
    powSelector: () => {},
  },
  {
    id: MoveEffectType.FeelingAllCureAngry,
    title: "FeelingAllCureAngry",
    powSelector: () => {},
  },
  {
    id: MoveEffectType.FieldTrap,
    title: "FieldTrap",
    header: "Field",
    ...DEFAULT_FIELD_TARGET,
  },
  {
    id: MoveEffectType.FieldRally,
    title: "FieldRally",
    ...DEFAULT_FIELD_TARGET,
  },
  {
    id: MoveEffectType.FieldRhythm,
    title: "FieldRhythm",
    ...DEFAULT_FIELD_TARGET,
  },
  {
    id: MoveEffectType.FieldDread,
    title: "FieldDread",
    ...DEFAULT_FIELD_TARGET,
  },
  {
    id: MoveEffectType.FieldQuake,
    title: "FieldQuake",
    ...DEFAULT_FIELD_TARGET,
  },
  {
    id: MoveEffectType.FieldBarrier,
    title: "FieldBarrier",
    ...DEFAULT_FIELD_TARGET,
    powSelector: () => {},
  },
  {
    id: MoveEffectType.FieldClear,
    title: "FieldClear",
    ...DEFAULT_FIELD_TARGET,
    powSelector: () => {},
  },
  {
    id: MoveEffectType.StaminaChange,
    title: "StaminaChange",
    header: "Stamina",
    step: 0.01,
  },
  { id: MoveEffectType.MaxStaminaChange, title: "MaxStaminaChange" },
  {
    id: MoveEffectType.FullRestore,
    title: "FullRestore",
    powSelector: () => {},
  },
  {
    id: MoveEffectType.StaminaSplit,
    title: "StaminaSplit",
    powSelector: () => {},
  },
  {
    id: MoveEffectType.Shift,
    title: "Shift",
    header: "Move",
    powSelector: ShiftInput,
  },
  {
    id: MoveEffectType.ShiftBeforeHit,
    title: "ShiftBeforeHit",
    powSelector: ShiftInput,
  },
  { id: MoveEffectType.Swap, title: "Swap", powSelector: () => {} },
  {
    id: MoveEffectType.SwapNoBall,
    title: "SwapNoBall",
    powSelector: () => {},
  },
  { id: MoveEffectType.TagOut, title: "TagOut", powSelector: () => {} },
  {
    id: MoveEffectType.TagOutBeforeHit,
    title: "TagOutBeforeHit",
    powSelector: () => {},
  },
  {
    id: MoveEffectType.TraitSwap,
    title: "TraitSwap",
    header: "Trait",
    powSelector: () => {},
  },
  {
    id: MoveEffectType.TraitCopy,
    title: "TraitCopy",
    powSelector: () => {},
  },
  {
    id: MoveEffectType.TraitGive,
    title: "TraitGive",
    powSelector: () => {},
  },
  {
    id: MoveEffectType.TraitSet,
    title: "TraitSet",
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
    title: "DamageAdjust",
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
    title: "CanHitWithoutVolley",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.GivesEasyRecieve,
    title: "GivesEasyRecieve",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.VolleyOnRecieve,
    title: "VolleyOnRecieve",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.NoRedirect,
    title: "NoRedirect",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.UseWhenPreventFeeling,
    title: "UseWhenPreventFeeling",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.IgnoresTrait,
    title: "IgnoresTrait",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.Mimic,
    title: "Mimic",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.PowMultiply,
    title: "PowMultiply",
    targetSelector: () => {},
    step: 0.1,
  },
  {
    id: MoveEffectType.Pass,
    title: "Pass",
    header: "Usage",
    powSelector: () => {},
  },
  { id: MoveEffectType.Charge, title: "Charge", targetSelector: () => {} },
  {
    id: MoveEffectType.ChargeReset,
    title: "ChargeReset",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.AddActions,
    title: "AddActions",
    targetSelector: () => {},
  },
  {
    id: MoveEffectType.Requires2Actions,
    title: "Requires2Actions",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.Requires3Actions,
    title: "Requires3Actions",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.PreventObstructed,
    title: "PreventObstructed",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.CanUseDefense,
    title: "CanUseDefense",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.RequiredVolleyState,
    title: "RequiredVolleyState",
    targetSelector: () => {},
    powSelector: ({ pow, setPow }) => (
      <select
        value={pow}
        onChange={(event) => setPow(Number(event.currentTarget.value))}
        ref={useAutoApply(setPow)}
      >
        <option value={0}>Not Hittable</option>
        <option value={1}>Hittable</option>
      </select>
    ),
  },
  {
    id: MoveEffectType.IfHittable,
    title: "IfHittable",
    header: "Effect Condition",
    ...NO_SELECTORS,
  },
  {
    id: MoveEffectType.IfSuccess,
    title: "IfSuccess",
    ...NO_SELECTORS,
  },
  { id: MoveEffectType.IfBlock, title: "IfBlock", ...NO_SELECTORS },
  { id: MoveEffectType.IfField, title: "IfField", ...FIELD_SELECTOR },
  { id: MoveEffectType.IfStamina, title: "IfStamina" },
  {
    id: MoveEffectType.IfFeeling,
    title: "IfFeeling",
    ...FEELING_SELECTOR,
  },
  {
    id: MoveEffectType.FeelAware,
    title: "FeelAware",
    header: "Unused (Not Recommended)",
    hasNegative: true,
  },
  { id: MoveEffectType.AdditionalPercent, title: "AdditionalPercent" },
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
  const { L } = useLocalization();

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
        {L("workshop.play.effects." + effect.title)}
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
          {L("workshop.play.effects.new")}
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
          {L("workshop.play.name")}
          <StringDataInput
            value={play.name}
            setValue={(new_value) => setKey("name", new_value)}
          />
        </label>
        <label>
          {L("workshop.play.type")}
          <select
            value={String(play.type)}
            onChange={(event) => {
              const new_type = Number(event.target.value);
              setKey("type", new_type);
              if (new_type < 3 != play.type < 3) setKey("target", 0);
            }}
          >
            <option value={0}>{L("common.types.body")}</option>
            <option value={1}>{L("common.types.spirit")}</option>
            <option value={2}>{L("common.types.mind")}</option>
            <option value={3}>{L("common.types.volley")}</option>
            <option value={4}>{L("common.types.support")}</option>
            <option value={5}>{L("common.types.defense")}</option>
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
          {L("workshop.play.use.title")}
          <select
            value={String(play.use)}
            onChange={(event) => setKey("use", Number(event.target.value))}
          >
            <option value={0}>{L("workshop.play.use.anywhere")}</option>
            <option value={1}>{L("workshop.play.use.backRow")}</option>
            <option value={2}>{L("workshop.play.use.frontRow")}</option>
          </select>
        </label>
        <label>
          {L("workshop.play.target.title")}
          <select
            value={String(play.target)}
            onChange={(event) => setKey("target", Number(event.target.value))}
          >
            {play.type < 3 ? (
              <>
                <option value={0}>
                  {L("workshop.play.target.attack.straight")}
                </option>
                <option value={1}>
                  {L("workshop.play.target.attack.ahead")}
                </option>
                <option value={4}>
                  {L("workshop.play.target.attack.front")}
                </option>
                <option value={8}>
                  {L("workshop.play.target.attack.back")}
                </option>
                <option value={12}>
                  {L("workshop.play.target.attack.sideways")}
                </option>
                <option value={13}>
                  {L("workshop.play.target.attack.nearest")}
                </option>
                <option value={3}>
                  {L("workshop.play.target.attack.benchedAlly")}
                </option>
              </>
            ) : (
              <>
                <option value={0}>
                  {L("workshop.play.target.support.none")}
                </option>
                <option value={8}>
                  {L("workshop.play.target.support.benchedAlly")}
                </option>
                <option value={9}>
                  {L("workshop.play.target.support.anyAlly")}
                </option>
                <option value={4}>
                  {L("workshop.play.target.support.fieldedOpponent")}
                </option>
                <option value={5}>
                  {L("workshop.play.target.support.fieldedBeastieNoUser")}
                </option>
                <option value={6}>
                  {L("workshop.play.target.support.fieldedBeastie")}
                </option>
                <option value={7}>
                  {L("workshop.play.target.support.fieldedAllyOpponent")}
                </option>
              </>
            )}
          </select>
        </label>
        <div>
          {L("workshop.play.learnedBy")}
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
            textOverride={L("workshop.play.addBeastie")}
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
        <div>{L("workshop.play.effects.title")}</div>
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
