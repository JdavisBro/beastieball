import abilities from "../../data/abilities";
import BEASTIE_DATA from "../../data/BeastieData";
import MOVE_DIC from "../../data/MoveData";
import BeastieSelect from "../../shared/BeastieSelect";
import type { TeamBeastie } from "../Types";

export default function EditBeastie({
  beastie,
  setBeastie,
}: {
  beastie: TeamBeastie;
  setBeastie: React.Dispatch<React.SetStateAction<TeamBeastie>>;
}) {
  const changeValue: <T extends keyof TeamBeastie>(
    key: T,
    value: TeamBeastie[T],
  ) => void = (key, value) => {
    setBeastie((beastie) => ({ ...beastie, [key]: value }));
  };
  const beastiedata = BEASTIE_DATA.get(beastie.specie);
  if (!beastiedata) {
    return null;
  }
  const extraPoints = Math.min(
    30,
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

  return (
    <>
      <label>
        Specie:{" "}
        <BeastieSelect
          beastieId={beastie.specie}
          setBeastieId={(beastieId) => {
            console.log(beastieId);
            if (beastieId) {
              changeValue("specie", beastieId);
              const newBeastie = BEASTIE_DATA.get(beastieId);
              if (!newBeastie) {
                return;
              }
              if (beastie.name == beastiedata.name) {
                changeValue("name", newBeastie.name);
              }
              changeValue(
                "attklist",
                beastie.attklist.map((moveId) =>
                  newBeastie.attklist.includes(moveId)
                    ? moveId
                    : newBeastie.attklist[0],
                ),
              );
            }
          }}
        />
      </label>
      <label>
        Name:{" "}
        <input
          type="text"
          maxLength={12}
          defaultValue={beastie.name}
          onChange={(event) => changeValue("name", event.target.value)}
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
            changeValue("number", event.target.value.padStart(2, "0"))
          }
        />
      </label>
      <label>
        Level:{" "}
        <input
          type="number"
          min={1}
          max={100}
          defaultValue={Math.floor(Math.cbrt(beastie.xp / beastiedata.growth))}
          onChange={(event) =>
            changeValue(
              "xp",
              Number(event.target.value) ** 3 * beastiedata.growth,
            )
          }
        />
      </label>
      <label>
        Trait:{" "}
        <select
          onChange={(event) =>
            changeValue("ability_index", Number(event.target.value))
          }
        >
          {beastiedata.ability.map((abilityId, index) => (
            <option key={abilityId} value={index}>
              {abilities[abilityId].name}
            </option>
          ))}
        </select>
      </label>
      <div>Coaching</div>
      <div>
        <label>
          Body POW{" "}
          <input
            type="number"
            min={0}
            max={100}
            defaultValue={beastie.ba_r * 100}
            onChange={(event) =>
              changeValue("ba_r", Number(event.target.value) / 100)
            }
          />
          %
        </label>
        {" - "}
        <label>
          Body DEF{" "}
          <input
            type="number"
            min={0}
            max={100}
            defaultValue={beastie.bd_r * 100}
            onChange={(event) =>
              changeValue("bd_r", Number(event.target.value) / 100)
            }
          />
          %
        </label>
      </div>
      <div>
        <label>
          Spirit POW{" "}
          <input
            type="number"
            min={0}
            max={30}
            defaultValue={beastie.ha_r * 100}
            onChange={(event) =>
              changeValue("ha_r", Number(event.target.value) / 100)
            }
          />
          %
        </label>
        {" - "}
        <label>
          Spirit DEF{" "}
          <input
            type="number"
            min={0}
            max={30}
            defaultValue={beastie.hd_r * 100}
            onChange={(event) =>
              changeValue("hd_r", Number(event.target.value) / 100)
            }
          />
          %
        </label>
      </div>
      <div>
        <label>
          Mind POW{" "}
          <input
            type="number"
            min={0}
            max={30}
            defaultValue={beastie.ma_r * 100}
            onChange={(event) =>
              changeValue("ma_r", Number(event.target.value) / 100)
            }
          />
          %
        </label>
        {" - "}
        <label>
          Mind DEF{" "}
          <input
            type="number"
            min={0}
            max={30}
            defaultValue={beastie.md_r * 100}
            onChange={(event) =>
              changeValue("md_r", Number(event.target.value) / 100)
            }
          />
          %
        </label>
      </div>
      <div>Training</div>
      <div>
        <label>
          Body POW +
          <input
            type="number"
            min={0}
            max={Math.min(Math.floor(beastie.ba_t / 4) + extraPoints, 30)}
            defaultValue={Math.floor(beastie.ba_t / 4)}
            onChange={(event) =>
              changeValue("ba_t", Number(event.target.value) * 4)
            }
          />
        </label>
        {" - "}
        <label>
          Body DEF +
          <input
            type="number"
            min={0}
            max={Math.min(Math.floor(beastie.bd_t / 4) + extraPoints, 30)}
            defaultValue={Math.floor(beastie.bd_t / 4)}
            onChange={(event) =>
              changeValue("bd_t", Number(event.target.value) * 4)
            }
          />
        </label>
      </div>
      <div>
        <label>
          Spirit POW +
          <input
            type="number"
            min={0}
            max={Math.min(Math.floor(beastie.ha_t / 4) + extraPoints, 30)}
            defaultValue={Math.floor(beastie.ha_t / 4)}
            onChange={(event) =>
              changeValue("ha_t", Number(event.target.value) * 4)
            }
          />
        </label>
        {" - "}
        <label>
          Spirit DEF +
          <input
            type="number"
            min={0}
            max={Math.min(Math.floor(beastie.hd_t / 4) + extraPoints, 30)}
            defaultValue={Math.floor(beastie.hd_t / 4)}
            onChange={(event) =>
              changeValue("hd_t", Number(event.target.value) * 4)
            }
          />
        </label>
      </div>
      <div>
        <label>
          Mind POW +
          <input
            type="number"
            min={0}
            max={Math.min(Math.floor(beastie.ma_t / 4) + extraPoints, 30)}
            defaultValue={Math.floor(beastie.ma_t / 4)}
            onChange={(event) =>
              changeValue("ma_t", Number(event.target.value) * 4)
            }
          />
        </label>
        {" - "}
        <label>
          Mind DEF +
          <input
            type="number"
            min={0}
            max={Math.min(Math.floor(beastie.md_t / 4) + extraPoints, 30)}
            defaultValue={Math.floor(beastie.md_t / 4)}
            onChange={(event) =>
              changeValue("md_t", Number(event.target.value) * 4)
            }
          />
        </label>
      </div>
      <div>
        <Plays
          attklist={beastiedata.attklist}
          selected={beastie.attklist[0]}
          setMove={(move) => {
            beastie.attklist[0] = move;
            changeValue("attklist", beastie.attklist);
          }}
        />
        <Plays
          attklist={beastiedata.attklist}
          selected={beastie.attklist[1]}
          setMove={(move) => {
            beastie.attklist[1] = move;
            changeValue("attklist", beastie.attklist);
          }}
        />
        <Plays
          attklist={beastiedata.attklist}
          selected={beastie.attklist[2]}
          setMove={(move) => {
            beastie.attklist[2] = move;
            changeValue("attklist", beastie.attklist);
          }}
        />
      </div>
    </>
  );
}

function Plays({
  attklist,
  selected,
  setMove,
}: {
  attklist: string[];
  selected: string;
  setMove: (move: string) => void;
}) {
  return (
    <select
      defaultValue={selected}
      onChange={(event) => setMove(event.target.value)}
    >
      {attklist
        .sort((moveId, moveId2) =>
          MOVE_DIC[moveId].name.localeCompare(MOVE_DIC[moveId2].name),
        )
        .map((moveId) => (
          <option key={moveId} value={moveId}>
            {MOVE_DIC[moveId].name}
          </option>
        ))}
    </select>
  );
}
