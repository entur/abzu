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

import React from "react";
import FeatureCheckbox from "../../../EditStopPage/PlaceFeatures/FeatureCheckbox";
import type {
  FacilityTabItem,
  FacilityTabItemProps,
} from "../../../EditStopPage/Facility/types";
import { DescribedEquipmentKey, readEquipment } from "./equipmentDetails";
import { useUpdateDescribedEquipment } from "./hooks/useUpdateDescribedEquipment";

interface EquipmentPresenceCheckboxProps extends FacilityTabItemProps {
  equipmentKey: DescribedEquipmentKey;
  icon: React.ReactElement;
}

/**
 * "There is a shelter / waiting room" (F-25). Ticking stores an empty
 * equipment, so seats, walls, heating and step-free access stay unknown
 * until they are answered, instead of being saved as "no".
 */
export const EquipmentPresenceCheckbox = ({
  entity,
  entityType,
  disabled,
  id,
  index,
  equipmentKey,
  icon,
}: EquipmentPresenceCheckboxProps) => {
  const update = useUpdateDescribedEquipment(
    equipmentKey,
    entityType,
    id ?? index,
  );
  const isPresent = readEquipment(entity, equipmentKey) !== null;

  const handleChange = (isTicked: boolean) => {
    if (disabled) return;
    update(isTicked ? {} : null);
  };

  return (
    <FeatureCheckbox
      icon={icon}
      handleFeatureStateChange={handleChange}
      name={equipmentKey as FacilityTabItem}
      isFeaturePresent={isPresent}
    />
  );
};
