import { FeatureComponent } from "@entur/react-component-toggle";
import { useMemo } from "react";
import { WMTSLayer } from "../../components/Map/WMTSLayer";
import { useGktToken } from "./hooks/useGktToken";
import { KartverketFlyFotoLayerProps } from "./types";

const BASE_URL =
  "https://gatekeeper1.geonorge.no/BaatGatekeeper/gk/gk.nib_web_mercator_wmts_v2";

export const KartverketFlyFotoLayer: FeatureComponent<
  KartverketFlyFotoLayerProps
> = () => {
  const token = useGktToken();

  const params = useMemo(() => {
    return {
      gkt: token,
    };
  }, [token]);

  if (!token) {
    return null;
  }

  return (
    <WMTSLayer
      baseUrl={BASE_URL}
      params={params}
      attribution='&copy; <a href="http://www.kartverket.no">Kartverket'
    />
  );
};
