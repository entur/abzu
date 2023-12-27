import { useContext, useEffect, useState } from "react";
import Axios from "axios";
import { ConfigContext } from "../../../config/ConfigContext";

const INTERVAL_IN_MS = 60000;

export const useGktToken = () => {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("ABZU::GKT_TOKEN") || "null"),
  );

  const config = useContext(ConfigContext);

  useEffect(() => {
    const fetchNewToken = async () => {
      const response = await Axios.get(config.baatTokenProxyEndpoint!);
      const newToken = JSON.stringify(response.data);
      localStorage.setItem("ABZU::GKT_TOKEN", newToken);
      setToken(response.data);
    };

    const fetchTokenService = async () => {
      if (
        token === null ||
        token.expires < new Date(Date.now() + 60 * 1000 * 30).getTime()
      ) {
        try {
          await fetchNewToken();
        } catch (err) {
          console.warn(
            "Failed to get GK token, Kartverket Flyfoto will not work",
            err,
          );
        }
      }
    };

    fetchTokenService();

    const fetchTokenInterval = setInterval(fetchTokenService, INTERVAL_IN_MS);

    return () => {
      clearInterval(fetchTokenInterval);
    };
  }, [config.baatTokenProxyEndpoint]);

  return token && token.gkt;
};
