import { FeatureComponent } from "@entur/react-component-toggle";
import { TileLayer as LeafletTileLayer } from "react-leaflet";
import { TileLayer } from "../../config/ConfigContext";
import { useNibToken } from "./hooks/useNibToken";

const TILE_URL =
  "https://tilecache.norgeibilder.no/arcgis/rest/services/Nibcache_web_mercator_v2/MapServer/tile/{z}/{y}/{x}";

export const KartverketFlyFotoLayer: FeatureComponent<TileLayer> = (props) => {
  const token = useNibToken();

  if (!token) {
    return null;
  }

  return (
    <LeafletTileLayer
      url={`${TILE_URL}?token=${token}`}
      attribution='&copy; <a href="https://www.norgeibilder.no/">Kartverket - Norge i bilder</a>'
      maxZoom={props.maxZoom || 20}
      maxNativeZoom={props.maxNativeZoom}
    />
  );
};
