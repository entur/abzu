import { submodes as allSubmodes } from "../models/submodes";

export const isLegalChildStopPlace = (stopPlace) => {
  if (!stopPlace) {
    return false;
  }

  return stopPlace.permissions?.canEdit || false;
};

export const getInverseSubmodesWhitelist = (whitelist) => {
  return allSubmodes.filter((submode) => whitelist.indexOf(submode) === -1);
};
