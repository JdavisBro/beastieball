import { SaveBeastie } from "./SaveType";

export default function Beastie(props: {
  beastie: SaveBeastie;
}): React.ReactElement {
  return (
    <div>
      <img />
      <div>
        {props.beastie.name}#{props.beastie.number}
      </div>
      <div>Level: {props.beastie.level}</div>
    </div>
  );
}
