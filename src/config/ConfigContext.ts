import React from "react";

interface Config {
  baatTokenProxyEndpoint?: string;
}

export const ConfigContext = React.createContext<Config>({});
