import React, { useMemo } from "react";
import { TileLayer } from "react-leaflet";
import L from "leaflet";

export interface WMTSLayerProps {
  baseUrl: string;
  token: string;
}

export const WMTSLayer: React.FC<WMTSLayerProps> = ({ baseUrl, token }) => {
  const wmtsParams = useMemo(
    () =>
      L.Util.getParamString({
        service: "WMTS",
        request: "GetTile",
        version: "1.1.1",
        style: "default",
        format: "image/png",
        transparent: "false",
        tilematrixSet: "default028mm",
        layers: "toporaster2",
        gkt: token,
      }),
    [token]
  );

  const url = useMemo(
    () => `${baseUrl}${wmtsParams}&tilematrix={z}&tilerow={y}&tilecol={x}`,
    [baseUrl, wmtsParams]
  );

  return (
    <TileLayer
      attribution='&copy; <a href="http://www.kartverket.no">Kartverket'
      url={url}
      maxZoom={19}
    />
  );
};
