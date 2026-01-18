import { useState } from "react";
import Modal from "../../shared/Modal";
import { Encounter } from "../../data/EncounterData";
import useLocalization from "../../localization/useLocalization";

export default function AiInfo({ encounter }: { encounter: Encounter }) {
  const { L } = useLocalization();

  const [open, setOpen] = useState(false);

  const ai = encounter.ai;

  const data: ([string, number | string] | null)[] = [
    ["erratic", ai.erratic],
    ["damage", ai.damage],
    ["point", ai.point],
    ["stamina", ai.stamina],
    ["lane", ai.lane],
    ["lane_offense", ai.lane_cover],
    ["straight_fear", ai.lane_straight_fear],
    ["sideways_fear", ai.lane_sideways_fear],
    ["field", ai.field],
    ["foe_field", ai.foe_field],
    ["feeling", ai.status],
    ["foe_feeling", ai.foe_status],
    ["boosts", ai.boost],
    ["foe_boosts", ai.foe_boost],
    ["blocking", ai.blocking],
    ["knockout", ai.fall],
    ["foe_knockout", ai.knockout],
    ["non_easy", ai.force],
    [
      "secondary",
      ai.secondary
        ? L("teams.encounters.aiinfo.true")
        : L("teams.encounters.aiinfo.false"),
    ],
    ["tag", String(ai.tag_penalty)],
    ["usable", ai.usable_attack],

    encounter.team.some((beastie) => beastie.aggro)
      ? ["rowdy", ai.meter]
      : null,
  ];

  return (
    <>
      <button onClick={() => setOpen(true)}>
        {L("teams.encounters.aiinfo.title")}
      </button>
      <Modal
        header={L("teams.encounters.aiinfo.title")}
        open={open}
        makeOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        hashValue="AiInfo"
      >
        <table>
          <tr>
            <th>{L("teams.encounters.aiinfo.type")}</th>
            <th>{L("teams.encounters.aiinfo.value")}</th>
          </tr>
          {data
            .filter((v) => !!v)
            .map(([desc, value]) => (
              <tr key={desc}>
                <td>{L("teams.encounters.aiinfo." + desc)}</td>
                <td>{typeof value == "number" ? `${value}x` : value}</td>
              </tr>
            ))}
        </table>
      </Modal>
    </>
  );
}
