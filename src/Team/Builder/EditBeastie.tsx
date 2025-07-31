import { useState } from "react";
import abilities from "../../data/abilities";
import BEASTIE_DATA from "../../data/BeastieData";
import useLocalization from "../../localization/useLocalization";
import BeastieSelect from "../../shared/BeastieSelect";
import type { TeamBeastie } from "../Types";
import MoveSelect from "./MoveSelect";
import { Box } from "./TeamBuilder";
import styles from "./TeamBuilder.module.css";

const TYPES = [
  ["b", "body"],
  ["h", "spirit"],
  ["m", "mind"],
];

type COACHING = "ba_r" | "bd_r" | "ha_r" | "hd_r" | "ma_r" | "md_r";
type TRAINING = "ba_t" | "bd_t" | "ha_t" | "hd_t" | "ma_t" | "md_t";
type STAT_MOD = COACHING | TRAINING;

const COLOR_TYPE: Record<number, "color" | "shiny" | "color2"> = {
  0: "color",
  1: "shiny",
  2: "color2",
};

const MIN_BEASITE_COLOR = 0.000000000000001;
const MAX_BEASITE_COLOR = 0.999999999999999;

function clampColor(color: number) {
  return Math.max(Math.min(color, MAX_BEASITE_COLOR), MIN_BEASITE_COLOR);
}

type ChangeValueType = <T extends keyof TeamBeastie>(
  key: T,
  value: TeamBeastie[T],
) => void;

function BeastieDoesntExist({ changeValue }: { changeValue: ChangeValueType }) {
  const { L } = useLocalization();

  return (
    <label>
      {L("teams.builder.species")}
      <BeastieSelect
        beastieId={undefined}
        setBeastieId={(beastieId) => {
          if (beastieId) {
            changeValue("specie", beastieId);
          }
        }}
      />
    </label>
  );
}

function StatInput({
  beastie,
  changeValue,
  max,
  valKey,
  statMod,
}: {
  beastie: TeamBeastie;
  changeValue: (key: STAT_MOD, value: number) => void;
  max: number | ((key: STAT_MOD) => number);
  valKey: STAT_MOD;
  statMod: (stat: number) => number;
}) {
  return (
    <input
      type="number"
      min={0}
      max={typeof max == "number" ? max : max(valKey)}
      value={statMod(beastie[valKey])}
      onChange={(event) =>
        changeValue(valKey, Number(event.currentTarget.value))
      }
      className={styles.statinput}
    />
  );
}

function StatSelect({
  beastie,
  changeValue,
  valueSuffix,
  max,
  statMod,
  statPre,
  statPost,
  end,
}: {
  beastie: TeamBeastie;
  changeValue: (key: STAT_MOD, value: number) => void;
  valueSuffix: "_r" | "_t";
  max: number | ((key: STAT_MOD) => number);
  statMod: (stat: number) => number;
  statPre: string;
  statPost: string;
  end: React.ReactNode;
}) {
  return (
    <div className={styles.statselect}>
      <div className={styles.statrow}>
        <div className={styles.stattop}>POW</div>
        <div className={styles.stattopsep}></div>
        <div className={styles.stattop}>DEF</div>
      </div>
      {TYPES.map(([char, name], index) => (
        <div className={styles.statrow} key={char}>
          <div>
            {statPre}
            <StatInput
              beastie={beastie}
              changeValue={changeValue}
              valKey={(char + "a" + valueSuffix) as STAT_MOD}
              max={max}
              statMod={statMod}
            />
            {statPost}
          </div>
          <img
            className={styles.statimg}
            src={`/gameassets/sprIcon/${index}.png`}
            alt={name}
          />
          <div>
            {statPre}
            <StatInput
              beastie={beastie}
              changeValue={changeValue}
              valKey={(char + "d" + valueSuffix) as STAT_MOD}
              max={max}
              statMod={statMod}
            />
            {statPost}
          </div>
        </div>
      ))}
      {end}
    </div>
  );
}

function StatOptions({
  beastie,
  changeValue,
}: {
  beastie: TeamBeastie;
  changeValue: ChangeValueType;
}) {
  const [training, setTraining] = useState(true);

  const extraPoints = Math.min(
    Math.max(
      0,
      Math.ceil(
        (240 -
          (beastie.ba_t +
            beastie.bd_t +
            beastie.ha_t +
            beastie.hd_t +
            beastie.ma_t +
            beastie.md_t)) /
          4,
      ),
    ),
  );

  const setAllCoaching = (value: number) => {
    TYPES.map(([char]) => {
      changeValue((char + "a_r") as COACHING, value);
      changeValue((char + "d_r") as COACHING, value);
    });
  };

  return (
    <div>
      <div className={styles.tabs}>
        <button
          className={training ? styles.selectedtab : undefined}
          onClick={() => setTraining(true)}
        >
          Training
        </button>
        <button
          className={training ? undefined : styles.selectedtab}
          onClick={() => setTraining(false)}
        >
          Coaching
        </button>
      </div>
      <div className={styles.tabcontainer}>
        <StatSelect
          beastie={beastie}
          changeValue={
            training
              ? (key, value) =>
                  changeValue(
                    key,
                    Math.min(
                      value,
                      Math.floor(beastie[key] / 4) + extraPoints,
                      30,
                    ) * 4,
                  )
              : (key, value) =>
                  changeValue(key, Math.max(0, Math.min(1, value / 100)))
          }
          valueSuffix={training ? "_t" : "_r"}
          max={
            training
              ? (key) =>
                  Math.min(Math.floor(beastie[key] / 4) + extraPoints, 30)
              : 100
          }
          statMod={
            training
              ? (stat) => Math.floor(stat / 4)
              : (stat) => Math.round(stat * 100000) / 1000
          }
          statPre={training ? "+" : ""}
          statPost={training ? "" : "%"}
          end={
            training ? (
              <div className={styles.statrow}>
                {extraPoints} Points Left -{" "}
                <button
                  onClick={() =>
                    TYPES.map(([char]) => {
                      changeValue((char + "a_t") as TRAINING, 0);
                      changeValue((char + "d_t") as TRAINING, 0);
                    })
                  }
                >
                  Clear
                </button>
              </div>
            ) : (
              <div className={styles.statrow}>
                <button onClick={() => setAllCoaching(0)}>All to 0%</button>
                {" - "}
                <button onClick={() => setAllCoaching(1)}>All to 100%</button>
              </div>
            )
          }
        />
      </div>
    </div>
  );
}

export default function EditBeastie({
  beastie,
  setBeastie,
}: {
  beastie: TeamBeastie;
  setBeastie: React.Dispatch<React.SetStateAction<TeamBeastie>>;
}) {
  const changeValue: ChangeValueType = (key, value) => {
    setBeastie((beastie) => ({ ...beastie, [key]: value }));
  };
  const beastiedata = BEASTIE_DATA.get(beastie.specie);
  if (!beastiedata) {
    return <BeastieDoesntExist changeValue={changeValue} />;
  }

  return (
    <>
      <Box>
        <label>
          Species:{" "}
          <BeastieSelect
            beastieId={beastie.specie}
            setBeastieId={(beastieId) => {
              if (beastieId) {
                const newBeastie = BEASTIE_DATA.get(beastieId);
                if (!newBeastie) {
                  return;
                }
                changeValue("specie", beastieId);
                changeValue(
                  "xp",
                  (beastie.xp / beastiedata.growth) * newBeastie.growth,
                );
                if (beastie.name == beastiedata.name) {
                  changeValue("name", newBeastie.name);
                }
                changeValue(
                  "attklist",
                  beastie.attklist.reduce<string[]>(
                    (accum, moveId) => [
                      ...accum,
                      newBeastie.attklist.includes(moveId)
                        ? moveId
                        : (newBeastie.attklist.find(
                            (newMoveId) => !accum.includes(newMoveId),
                          ) ?? newBeastie.attklist[0]),
                    ],
                    [],
                  ),
                );
              }
            }}
          />
        </label>
        <label>
          Level:{" "}
          <input
            type="number"
            min={1}
            max={100}
            defaultValue={Math.floor(
              Math.cbrt(beastie.xp / beastiedata.growth),
            )}
            onChange={(event) =>
              changeValue(
                "xp",
                Number(event.currentTarget.value) ** 3 * beastiedata.growth,
              )
            }
          />
        </label>
        <label>
          Trait:{" "}
          <select
            defaultValue={beastie.ability_index}
            onChange={(event) =>
              changeValue("ability_index", Number(event.currentTarget.value))
            }
          >
            {beastiedata.ability.map((abilityId, index) => (
              <option key={abilityId} value={index}>
                {abilities[abilityId].name}
              </option>
            ))}
          </select>
        </label>
      </Box>
      <Box>
        <label>
          Name:{" "}
          <input
            type="text"
            maxLength={12}
            defaultValue={beastie.name}
            onChange={(event) => changeValue("name", event.currentTarget.value)}
          />
        </label>
        <label>
          Number:{" "}
          <input
            type="number"
            min={0}
            max={999}
            defaultValue={Number(beastie.number)}
            onChange={(event) =>
              changeValue("number", event.currentTarget.value.padStart(2, "0"))
            }
          />
        </label>
        <span>
          <label>
            Color:{" "}
            <select
              value={Math.floor(beastie.color[0])}
              onChange={(event) =>
                changeValue(
                  "color",
                  beastie.color.map(
                    (color) =>
                      clampColor(color - Math.ceil(color) + 1) +
                      Number(event.target.value),
                  ),
                )
              }
            >
              <option value={0}>Regular</option>
              {beastiedata.colors2 ? <option value={2}>Variant</option> : null}
              <option value={1}>Raremorph</option>
            </select>
          </label>
          <button
            onClick={() => {
              const colorAdd = Math.floor(beastie.color[0]);
              const colorType = COLOR_TYPE[colorAdd];
              const beastieColors:
                | { color: number[]; shiny: number[]; color2: number[] }
                | undefined = JSON.parse(
                localStorage.getItem("beastiecolors") ?? "{}",
              )[beastie.specie];
              const colors =
                (beastieColors && beastieColors[colorType]) ||
                new Array(beastie.color.length).fill(0.5);
              changeValue(
                "color",
                colors.map((color) => clampColor(color) + colorAdd),
              );
            }}
          >
            Copy from Beastiepedia
          </button>
        </span>
        {beastiedata.spr_alt.length ? (
          <label>
            Sprite:{" "}
            <select
              value={beastie.spr_index}
              onChange={(event) =>
                changeValue("spr_index", Number(event.currentTarget.value))
              }
            >
              <option value={0}>Normal</option>
              {beastiedata.spr_alt.map((_, index) => (
                <option key={index} value={index + 1}>
                  Alternate{beastiedata.spr_alt.length > 1 ? ` ${index}` : ""}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </Box>
      <MoveSelect
        beastieMovelist={beastiedata.attklist}
        teamBeastieMovelist={beastie.attklist}
        setMove={(index, move) => {
          beastie.attklist[index] = move;
          changeValue("attklist", beastie.attklist);
        }}
      />
      <StatOptions beastie={beastie} changeValue={changeValue} />
    </>
  );
}
