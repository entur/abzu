import React, { useContext } from "react";
import { OidcClientSettings } from "oidc-client-ts";

interface Config {
  baatTokenProxyEndpoint?: string;
  sentryDSN?: string;
  googleApiKey?: string;
  tiamatEnv?: string;
  preferredNameNamespace?: string;
  claimsNamespace?: string;
  oidcConfig?: OidcClientSettings;
}

export const ConfigContext = React.createContext<Config>({});

export const useConfig = () => {
  return useContext(ConfigContext);
};
