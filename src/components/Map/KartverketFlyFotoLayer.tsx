import React, { useMemo } from "react";
import { useGktToken } from "./useGktToken";
import { WMTSLayer } from "./WMTSLayer";

const BASE_URL =
  "https://gatekeeper1.geonorge.no/BaatGatekeeper/gk/gk.nib_web_mercator_wmts_v2";

export const KartverketFlyFotoLayer: React.FC = () => {
  const token = useGktToken();

  const params = useMemo(() => {
    return {
      gkt: token,
    };
  }, [token]);

  return (
    <WMTSLayer
      baseUrl={BASE_URL}
      params={params}
      attribution='&copy; <a href="http://www.kartverket.no">Kartverket'
    />
  );
};
