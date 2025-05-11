import { PropsWithChildren } from "react";

export function BoxHeader({ children }: PropsWithChildren) {
  return <div className="infoboxHeader">{children}</div>;
}

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export default function InfoBox(
  props: PropsWithChildren & {
    header: React.ReactNode;
    container?: DivProps;
    containerRef?: React.RefObject<HTMLDivElement>;
    headerClick?: React.MouseEventHandler<HTMLDivElement>;
  },
): React.ReactNode {
  return (
    <div {...props.container} ref={props.containerRef}>
      <div
        className="infoboxHeader"
        onClick={props.headerClick}
        tabIndex={props.headerClick ? 0 : -1}
        role={props.headerClick && "button"}
      >
        {props.header}
      </div>
      <div className="infoBoxContent">{props.children}</div>
    </div>
  );
}
