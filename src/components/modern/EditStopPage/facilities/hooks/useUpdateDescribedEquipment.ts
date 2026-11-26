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

import { UnknownAction } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { EquipmentActions } from "../../../../../actions";
import { useAppDispatch } from "../../../../../store/hooks";
import type { EntityType } from "../../../../../models/Entities";
import type {
  DescribedEquipmentKey,
  EquipmentDetails,
} from "../equipmentDetails";

/** The classic equipment actions store an object as given (no defaults). */
const ACTION_BY_KEY = {
  shelterEquipment: EquipmentActions.updateShelterEquipmentState,
  waitingRoomEquipment: EquipmentActions.updateWaitingRoomState,
} as const;

/**
 * Stores a shelter or waiting room on a stop (by id) or quay (by index):
 * an object to set it, null to remove it.
 */
export const useUpdateDescribedEquipment = (
  equipmentKey: DescribedEquipmentKey,
  entityType: EntityType,
  idOrIndex: string | number | undefined,
): ((equipment: EquipmentDetails | null) => void) => {
  const dispatch = useAppDispatch();

  return useCallback(
    (equipment: EquipmentDetails | null) => {
      const update = ACTION_BY_KEY[equipmentKey];
      dispatch(
        update(equipment, entityType, idOrIndex) as unknown as UnknownAction,
      );
    },
    [dispatch, equipmentKey, entityType, idOrIndex],
  );
};
