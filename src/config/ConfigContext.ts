import React from "react";

interface Config {
  baatTokenProxyEndpoint?: string;
  sentryDSN?: string;
  googleApiKey?: string;
}

export const ConfigContext = React.createContext<Config>({});
