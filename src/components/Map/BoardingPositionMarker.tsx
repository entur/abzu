import { divIcon, DragEndEvent } from "leaflet";
import React from "react";
import ReactDOM from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import Code from "../EditStopPage/Code";
import CopyIdButton from "../Shared/CopyIdButton";
import BoardingPositionMarkerIcon from "./BoardingPositionMarkerIcon";

type Props = {
  position: [number, number];
  id: string;
  publicCode: string;
  translations: Record<string, string>;
  handleChangeCoordinates: (event: React.MouseEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleSetFocus: () => void;
};

export default ({
  position,
  id,
  publicCode,
  translations,
  handleChangeCoordinates,
  handleDragEnd,
  handleSetFocus,
}: Props) => {
  const divBody = ReactDOM.renderToStaticMarkup(
    <BoardingPositionMarkerIcon publicCode={publicCode} />,
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
      eventHandlers={{
        dragend: handleDragEnd,
      }}
    >
      <Popup autoPan={false} eventHandlers={{ popupopen: handleSetFocus }}>
        <div>
          <div className="boarding-position-marker-title">
            <Code
              type="publicCode"
              value={publicCode}
              defaultValue={translations.notAssigned}
            />
          </div>
          <div className="marker-popup-id">
            {id}
            <CopyIdButton idToCopy={id} />
          </div>
          <div
            className="marker-popup-change-coordinates-wrapper"
            onClick={handleChangeCoordinates}
          >
            <span className="marker-popup-change-coordinate-item">
              {position[0]}
            </span>
            <span
              className="marker-popup-change-coordinate-item"
              style={{
                marginLeft: 3,
              }}
            >
              {position[1]}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
