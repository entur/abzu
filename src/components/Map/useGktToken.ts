import { useEffect, useState } from "react";
import Axios from "axios";

export const useGktToken = () => {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("ABZU::GKT_TOKEN") || "{}")
  );

  useEffect(() => {
    const fetchNewToken = async () => {
      const response = await Axios.get(window.config.endpointBase + "token");
      const newToken = JSON.stringify(response.data);
      localStorage.setItem("ABZU::GKT_TOKEN", newToken);
      setToken(newToken);
    };

    const fetchTokenInterval = setInterval(() => {
      if (
        token == null ||
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
    }, 1000);

    return () => {
      clearInterval(fetchTokenInterval);
    };
  }, []);

  return token.gkt;
};
