import React from "react";
import { useMapEvents } from "react-leaflet";

export interface MapEventsProps {
  handleBaselayerChanged: (name: string) => void;
  handleOverlayAdd: (name: string) => void;
  handleOverlayRemove: (name: string) => void;
  onClick: () => void;
  onDblclick: () => void;
  onZoomEnd: () => void;
  onMoveEnd: () => void;
  children: React.ReactNode;
}

export const MapEvents: React.FC<MapEventsProps> = ({
  children,
  handleBaselayerChanged = () => {},
  handleOverlayAdd = () => {},
  handleOverlayRemove = () => {},
  onClick = () => {},
  onDblclick = () => {},
  onZoomEnd = () => {},
  onMoveEnd = () => {},
}) => {
  useMapEvents({
    baselayerchange: ({ name }) => {
      handleBaselayerChanged(name);
    },
    overlayadd: ({ name }) => {
      handleOverlayAdd(name);
    },
    overlayremove: ({ name }) => {
      handleOverlayRemove(name);
    },
    click: onClick,
    dblclick: onDblclick,
    zoomend: onZoomEnd,
    moveend: onMoveEnd,
  });

  return <>{children}</>;
};
