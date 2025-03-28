import { TileLayer } from "react-leaflet";
import { TileProvider } from "../../../config/ConfigContext";

type DynamicTileLayerProps = {
  name: TileProvider;
  attribution?: string;
  url?: string;
  maxZoom?: number;
};

export const DynamicTileLayer = ({
  name,
  attribution,
  url,
  maxZoom,
}: DynamicTileLayerProps) => {
  const isValidLayer = attribution && url;
  if (!isValidLayer) {
    console.error(
      "Missing tile parameters for tile provider %s, check your bootstrap map config",
      name,
    );
  }

  return (
    isValidLayer && (
      <TileLayer attribution={attribution} url={url} maxZoom={maxZoom || 19} />
    )
  );
};
