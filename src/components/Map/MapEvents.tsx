import React from "react";
import { useMapEvents } from "react-leaflet";

export interface MapEventsProps {
  handleBaselayerChanged: (name: string) => void;
  children: JSX.Element
}

export const MapEvents: React.FC<MapEventsProps> = ({
  children,
  handleBaselayerChanged,
}) => {
  useMapEvents({
    baselayerchange: ({ name }) => {
      handleBaselayerChanged(name);
    },
  });

  return <>{children}</>;
};
