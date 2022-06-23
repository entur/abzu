import React from "react";

interface Config {
  baatTokenProxyEndpoint?: string;
  sentryDSN?: string;
  googleApiKey?: string;
  tiamatEnv?: string;
}

export const ConfigContext = React.createContext<Config>({});
