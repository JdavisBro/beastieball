import { PropsWithChildren } from "react";

export function BoxHeader({ children }: PropsWithChildren) {
  return <div className="infoboxHeader">{children}</div>;
}

export default function InfoBox(
  props: PropsWithChildren & {
    header: React.ReactNode;
    className?: string;
  },
): React.ReactNode {
  return (
    <div className={props.className}>
      <div className="infoboxHeader">{props.header}</div>
      <div className="infoBoxContentContainer">
        <div className="infoBoxContent">{props.children}</div>
      </div>
    </div>
  );
}
