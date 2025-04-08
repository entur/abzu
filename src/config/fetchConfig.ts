import { Config } from "./ConfigContext";

export const fetchConfig = async (): Promise<Config> => {
  const overrides: Config = {};

  if (import.meta.env.VITE_REACT_APP_TIAMAT_BASE_URL) {
    overrides.tiamatBaseUrl = import.meta.env.VITE_REACT_APP_TIAMAT_BASE_URL;
  }
  const response = await fetch(`${import.meta.env.BASE_URL}bootstrap.json`);
  const config: Config = await response.json();

  return Object.assign({}, config, overrides);
};
