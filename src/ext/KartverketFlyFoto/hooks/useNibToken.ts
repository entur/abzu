import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../../config/ConfigContext";

const INTERVAL_IN_MS = 60000;

export const useNibToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [expires, setExpires] = useState(0);

  const config = useContext(ConfigContext);

  useEffect(() => {
    const fetchToken = async () => {
      if (expires > Date.now() + 30 * 60 * 1000) {
        return;
      }
      try {
        const response = await Axios.get(config.baatTokenProxyEndpoint!);
        setToken(response.data.token);
        setExpires(response.data.expires);
      } catch (err) {
        console.warn(
          "Failed to get NIB token, ortofoto layer will not work",
          err,
        );
      }
    };

    fetchToken();
    const interval = setInterval(fetchToken, INTERVAL_IN_MS);
    return () => clearInterval(interval);
  }, [config.baatTokenProxyEndpoint]);

  return token;
};
