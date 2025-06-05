import { Config } from "../../config/ConfigContext";

export interface MatomoConfig extends Config {
  matomo: {
    src: string;
  };
}
