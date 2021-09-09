import React from "react";
import ReactDOM from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import BoardingPositionMarkerIcon from "./BoardingPositionMarkerIcon";
import { useMemo } from "react";

type Props = {
  position: [number, number];
  publicCode: string;
  handleDragEnd: (event: React.DragEvent) => void;
};

export default ({ position, publicCode, handleDragEnd }: Props) => {
  const divBody = ReactDOM.renderToStaticMarkup(
    <BoardingPositionMarkerIcon publicCode={publicCode} />
  );

  let icon = divIcon({
    html: divBody,
    iconSize: [22, 34],
    iconAnchor: [11, 34],
    popupAnchor: [5, 0],
  });

  return (
    <Marker
      draggable={true}
      position={position}
      icon={icon}
      onDragend={handleDragEnd}
    />
  );
};
