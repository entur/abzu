import { useEffect, useState } from "react";
import Axios from "axios";

const INTERVAL_IN_MS = 60000;

export const useGktToken = () => {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("ABZU::GKT_TOKEN") || "null")
  );

  useEffect(() => {
    const fetchNewToken = async () => {
      const response = await Axios.get("/token");
      const newToken = JSON.stringify(response.data);
      localStorage.setItem("ABZU::GKT_TOKEN", newToken);
      setToken(response.data);
    };

    const fetchTokenService = () => {
      if (
        token === null ||
        token.expires < new Date(Date.now() + 60 * 1000 * 30).getTime()
      ) {
        try {
          fetchNewToken();
        } catch (err) {
          console.warn(
            "Failed to get GK token, Kartverket Flyfoto will not work",
            err
          );
        }
      }
    };

    fetchTokenService();

    const fetchTokenInterval = setInterval(fetchTokenService, INTERVAL_IN_MS);

    return () => {
      clearInterval(fetchTokenInterval);
    };
  }, []);

  return token && token.gkt;
};
