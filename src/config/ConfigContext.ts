import { OidcClientSettings } from "oidc-client-ts";
import React, { useContext } from "react";

export interface Config {
  tiamatBaseUrl?: string;
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
