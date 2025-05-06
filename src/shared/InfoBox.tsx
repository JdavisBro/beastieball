import { PropsWithChildren } from "react";

export function BoxHeader({ children }: PropsWithChildren) {
  return <div className="infoboxHeader">{children}</div>;
}

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export default function InfoBox(
  props: PropsWithChildren &
    DivProps & {
      header: React.ReactNode;
      useRef: React.RefObject<HTMLDivElement>;
    },
): React.ReactNode {
  const { header, children } = props;

  return (
    <div {...(props as DivProps)} ref={props.useRef}>
      <div className="infoboxHeader">{header}</div>
      <div className="infoBoxContent">{children}</div>
    </div>
  );
}
