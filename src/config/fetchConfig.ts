import { Config } from "./ConfigContext";

export const fetchConfig = async (): Promise<Config> => {
  const response = await fetch(`/bootstrap.json`);
  return await response.json();
};
