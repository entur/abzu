import { getOTPClient } from "../clients";
import { findQuayUsage, findStopPlaceUsage } from "./queries";

export const checkStopPlaceUsage = (stopPlaceId) => {
  const client = getOTPClient();
  return client.query({
    fetchPolicy: "network-only",
    query: findStopPlaceUsage,
    variables: {
      stopPlaceId,
    },
  });
};

export const checkQuayUsage = (quayId) => {
  const client = getOTPClient();
  return client.query({
    fetchPolicy: "network-only",
    query: findQuayUsage,
    variables: {
      quayId,
    },
  });
};
