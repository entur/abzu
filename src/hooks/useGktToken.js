import { useEffect } from "react";
import Axios from "axios";

export const useGktToken = (path) => {
  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("ABZU::GKT_TOKEN"));
    if (
      token == null ||
      token.expires < new Date(Date.now() + 60 * 1000 * 30).getTime()
    ) {
      Axios.get(path + "token")
        .then((response) => {
          let token = JSON.stringify(response.data);
          localStorage.setItem("ABZU::GKT_TOKEN", token);
        })
        .catch((err) => {
          console.warn(
            "Failed to get GK token, Kartverket Flyfoto will not work",
            err
          );
        });
    }
  }, []);
};
