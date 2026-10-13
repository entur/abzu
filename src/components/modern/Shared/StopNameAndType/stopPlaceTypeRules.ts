/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

import stopTypes from "../../../../models/stopTypes";

/** "Type not defined" is never a valid choice, whatever the config hides. */
const UNDEFINED_STOP_TYPE = "other";

/**
 * Domain rule (F-15): a stop can be created or saved only with a real type:
 * not empty, not "other", and not one the deployment hides.
 */
export const isStopPlaceTypeValid = (
  stopPlaceType: string | null | undefined,
  hiddenStopTypes: string[] = [],
): boolean =>
  Boolean(stopPlaceType) &&
  stopPlaceType !== UNDEFINED_STOP_TYPE &&
  !hiddenStopTypes.includes(stopPlaceType!) &&
  Object.prototype.hasOwnProperty.call(stopTypes, stopPlaceType!);

/** The stop types a user may choose, in model order. */
export const getAllowedStopTypes = (hiddenStopTypes: string[] = []): string[] =>
  Object.keys(stopTypes).filter((stopPlaceType) =>
    isStopPlaceTypeValid(stopPlaceType, hiddenStopTypes),
  );
