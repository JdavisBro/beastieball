// mostly from https://gist.github.com/davetapley/475db95030f10cc79f1e133f4075fea4

import { Marker, MarkerProps } from "react-leaflet";
import { DivIcon } from "leaflet";

import L from "leaflet";
import { createPortal } from "react-dom";
import { useEffect } from "react";

type DivIconMarkerProps = {
  children: React.ReactNode;
  markerprops: MarkerProps;
  tagName: string;
  className: string;
  icon?: L.DivIconOptions;
  popup?: React.ReactElement;
};

const DivIconMarker = ({
  children,
  markerprops,
  tagName,
  className,
  icon,
  popup,
}: DivIconMarkerProps) => {
  const element = L.DomUtil.create(tagName, className);
  const divIcon = new DivIcon({ html: element, ...icon });

  const portal = createPortal(children, element);

  useEffect(() => {
    return () => {
      L.DomUtil.remove(element);
    };
  });

  return (
    <>
      <>{portal}</>
      <Marker icon={divIcon} {...markerprops}>
        {popup}
      </Marker>
    </>
  );
};
export default DivIconMarker;
