import stopTypes from "../models/stopTypes";
import { submodes } from "../models/submodes";

export const getInverseSubmodesWhitelist = (whitelist) => {
  return submodes.filter((submode) => whitelist.indexOf(submode) === -1);
};

export const getStopTypesForSubmodes = (legalSubmodes) => {
  let result = [];

  if (!legalSubmodes || !legalSubmodes.length) return result;

  const stopTypeKeys = Object.keys(stopTypes);

  for (let i = 0; i < stopTypeKeys.length; i++) {
    const stopType = stopTypes[stopTypeKeys[i]];
    const submodes = stopType.submodes || [];
    legalSubmodes.forEach((legalSubmode) => {
      if (submodes.indexOf(legalSubmode) > -1) {
        if (result.indexOf(stopTypeKeys[i]) === -1 && legalSubmode !== null) {
          result.push(stopTypeKeys[i]);
        }
      }
    });
  }
  return result;
};
