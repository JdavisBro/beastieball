import { PropsWithChildren } from "react";

export function BoxHeader({ children }: PropsWithChildren) {
  return <div className="infoboxHeader">{children}</div>;
}

export default function InfoBox(
  props: PropsWithChildren & {
    header: string;
  },
): React.ReactNode {
  return (
    <div>
      <div className="infoboxHeader">{props.header}</div>
      <div className="infoBoxContentContainer">
        <div className="infoBoxContent">{props.children}</div>
      </div>
    </div>
  );
}
