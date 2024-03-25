// mostly from https://gist.github.com/davetapley/475db95030f10cc79f1e133f4075fea4

import { Marker, MarkerProps } from "react-leaflet";
import { DivIcon } from "leaflet";

import L from "leaflet";
import { createPortal } from "react-dom";
import { useEffect } from "react";

type ReactProps = {
  children: Array<React.ReactElement | null>;
};

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6e724310e0ed089cf4b8b261b8badf71206ad9e8/types/leaflet/index.d.ts#L75
type ContainerProps = {
  tagName: string;
  className?: string;
  container?: HTMLElement;
};

type DivIconMarkerProps = ReactProps & { markerprops: MarkerProps } & {
  container: ContainerProps;
  icon?: L.DivIconOptions;
};
const DivIconMarker = ({
  children,
  markerprops,
  container,
  icon,
}: DivIconMarkerProps) => {
  const { tagName, className } = container;
  const element = L.DomUtil.create(tagName, className);
  const divIcon = new DivIcon({ html: element, ...icon });
  const portal = createPortal(children[0], element);

  useEffect(() => {
    return () => {
      L.DomUtil.remove(element);
    };
  });

  return (
    <>
      <>{portal}</>
      <Marker icon={divIcon} {...markerprops}>
        {children[1]}
      </Marker>
    </>
  );
};
export default DivIconMarker;
