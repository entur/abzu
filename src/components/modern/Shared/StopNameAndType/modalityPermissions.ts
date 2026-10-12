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

import { getAllowanceInfoFromLocationPermissions } from "../../../../utils/permissionsUtils";

interface ModalityPermissions {
  allowedStopPlaceTypes?: string[] | null;
  bannedStopPlaceTypes?: string[] | null;
  allowedSubmodes?: string[] | null;
  bannedSubmodes?: string[] | null;
}

export interface ModalityAllowance {
  legalStopPlaceTypes: string[];
  legalSubmodes: string[];
}

/**
 * Which stop types and submodes the user may choose for this stop, from its
 * (location) permissions (F-18, legacy parity). Missing arrays are treated as
 * empty, which the shared rules read as "no restriction"; with no
 * permissions at all this returns null and nothing is restricted. Tiamat
 * still validates on save.
 */
export const getModalityAllowance = (
  permissions: ModalityPermissions | null | undefined,
): ModalityAllowance | null => {
  if (!permissions) return null;
  const { legalStopPlaceTypes, legalSubmodes } =
    getAllowanceInfoFromLocationPermissions({
      allowedStopPlaceTypes: permissions.allowedStopPlaceTypes ?? [],
      bannedStopPlaceTypes: permissions.bannedStopPlaceTypes ?? [],
      allowedSubmodes: permissions.allowedSubmodes ?? [],
      bannedSubmodes: permissions.bannedSubmodes ?? [],
    });
  return { legalStopPlaceTypes, legalSubmodes };
};

/**
 * A plain type needs the type itself to be legal; a submode needs that
 * submode to be legal (legacy ModalitiesMenuItems).
 */
export const isModalityAllowed = (
  allowance: ModalityAllowance | null,
  stopPlaceType: string,
  submode: string | null,
): boolean => {
  if (!allowance) return true;
  return submode
    ? allowance.legalSubmodes.includes(submode)
    : allowance.legalStopPlaceTypes.includes(stopPlaceType);
};
