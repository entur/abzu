import L from "leaflet";
import React, { useMemo } from "react";
import { TileLayer } from "react-leaflet";

export interface WMTSLayerProps {
  baseUrl: string;
  params: Record<string, string>;
  attribution: string;
  maxZoom?: number;
  maxNativeZoom?: number;
}

const DEFAULT_PARAMS = {
  service: "WMTS",
  request: "GetTile",
  version: "1.1.1",
  style: "default",
  format: "image/png",
  transparent: "false",
  tilematrixSet: "default028mm",
  layers: "toporaster2",
};

export const WMTSLayer: React.FC<WMTSLayerProps> = ({
  baseUrl,
  params,
  attribution,
  maxZoom,
  maxNativeZoom,
}) => {
  const wmtsParams: string = useMemo(() => {
    const newParams: Record<string, string> = Object.assign({}, DEFAULT_PARAMS);

    Object.keys(params).forEach((key) => {
      newParams[key] = params[key];
    });

    return L.Util.getParamString(newParams);
  }, [params]);

  const url = useMemo(
    () => `${baseUrl}${wmtsParams}&tilematrix={z}&tilerow={y}&tilecol={x}`,
    [wmtsParams],
  );

  return (
    <TileLayer
      attribution={attribution}
      url={url}
      maxZoom={maxZoom || 19}
      maxNativeZoom={maxNativeZoom}
    />
  );
};
