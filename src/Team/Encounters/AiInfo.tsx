import { useState } from "react";
import Modal from "../../shared/Modal";
import { Encounter } from "../../data/EncounterData";

export default function AiInfo({ encounter }: { encounter: Encounter }) {
  const [open, setOpen] = useState(false);

  const ai = encounter.ai;

  const data: ([string, number | string] | null)[] = [
    ["Erraticness", ai.erratic],
    ["Damage", ai.damage],
    ["Free Points", ai.point],
    ["Stamina", ai.stamina],
    ["Lane Coverage", ai.lane],
    ["Lane Coverage (Offense only)", ai.lane_cover],
    ["Straight Fear", ai.lane_straight_fear],
    ["Sideways Fear", ai.lane_sideways_fear],
    ["Ally Field", ai.field],
    ["Foe Field", ai.foe_field],
    ["Ally Feelings", ai.status],
    ["Foe Feelings", ai.foe_status],
    ["Ally Boosts", ai.boost],
    ["Foe Boosts", ai.foe_boost],
    ["Blocking", ai.blocking],
    ["Ally Knockout Potential", ai.fall],
    ["Foe Knockout Potential", ai.knockout],
    ["Non-easy Recieve Bonus", ai.force],
    ["Consider Attack Secondary Effects", ai.secondary ? "true" : "false"],
    ["Tag Penalty", String(ai.tag_penalty)],
    ["Usable Attack", ai.usable_attack],

    encounter.team.some((beastie) => beastie.aggro)
      ? ["Rowdy Meter", ai.meter]
      : null,
  ];

  return (
    <>
      <button onClick={() => setOpen(true)}>AI Info</button>
      <Modal
        header="AI Info"
        open={open}
        makeOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        hashValue="AiInfo"
      >
        <table>
          <tr>
            <th>Type</th>
            <th>Multiplier / Value / Enabled</th>
          </tr>
          {data
            .filter((v) => !!v)
            .map(([desc, value]) => (
              <tr key={desc}>
                <td>{desc}</td>
                <td>{typeof value == "number" ? `${value}x` : value}</td>
              </tr>
            ))}
        </table>
      </Modal>
    </>
  );
}
