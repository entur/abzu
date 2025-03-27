import { TileProvider } from "../../../config/ConfigContext";
import { KartverketFlyFotoLayer } from "./KartverketFlyFotoLayer";

export const tileComponentMap = {
  [TileProvider.KARTVERKET_FLYFOTO]: <KartverketFlyFotoLayer />,
};
