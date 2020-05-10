import { createOTPClient } from "../clients";
import { findStopPlaceUsage, findQuayUsage } from "./queries";

export const checkStopPlaceUsage = (stopPlaceId) => {
  const client = createOTPClient();
  return client.query({
    fetchPolicy: "network-only",
    query: findStopPlaceUsage,
    variables: {
      stopPlaceId,
    },
  });
};

export const checkQuayUsage = (quayId) => {
  const client = createOTPClient();
  return client.query({
    fetchPolicy: "network-only",
    query: findQuayUsage,
    variables: {
      quayId,
    },
  });
};
