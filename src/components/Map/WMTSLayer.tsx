import React, { useMemo } from "react";
import { TileLayer } from "react-leaflet";
import L from "leaflet";
import { useGktToken } from "./useGktToken";

const BASE_URL =
  "https://gatekeeper1.geonorge.no/BaatGatekeeper/gk/gk.nib_web_mercator_wmts_v2";

export const WMTSLayer: React.FC = () => {
  const token = useGktToken();

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
    () => `${BASE_URL}${wmtsParams}&tilematrix={z}&tilerow={y}&tilecol={x}`,
    [wmtsParams]
  );

  return (
    <TileLayer
      attribution='&copy; <a href="http://www.kartverket.no">Kartverket'
      url={url}
      maxZoom={19}
    />
  );
};
