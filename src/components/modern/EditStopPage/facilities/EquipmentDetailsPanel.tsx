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

import { Box } from "@mui/material";
import React from "react";
import type { FacilityTabItemProps } from "../../../EditStopPage/Facility/types";
import { EquipmentDetailRow } from "./EquipmentDetailRow";
import {
  DescribedEquipmentKey,
  EquipmentDetailField,
  readAnswer,
  readEquipment,
  withAnswer,
} from "./equipmentDetails";
import { useUpdateDescribedEquipment } from "./hooks/useUpdateDescribedEquipment";

export interface EquipmentDetailDefinition {
  field: EquipmentDetailField;
  icon: React.ReactElement;
}

interface EquipmentDetailsPanelProps extends FacilityTabItemProps {
  equipmentKey: DescribedEquipmentKey;
  details: EquipmentDetailDefinition[];
}

/** The details under a ticked shelter or waiting room, each yes / no / not set. */
export const EquipmentDetailsPanel = ({
  entity,
  entityType,
  disabled,
  id,
  index,
  equipmentKey,
  details,
}: EquipmentDetailsPanelProps) => {
  const update = useUpdateDescribedEquipment(
    equipmentKey,
    entityType,
    id ?? index,
  );
  const equipment = readEquipment(entity, equipmentKey);

  return (
    <Box sx={{ px: 2, py: 0.5 }}>
      {details.map(({ field, icon }) => (
        <EquipmentDetailRow
          key={field}
          icon={icon}
          labelId={field}
          answer={readAnswer(equipment, field)}
          disabled={disabled || equipment === null}
          onChange={(answer) => update(withAnswer(equipment, field, answer))}
        />
      ))}
    </Box>
  );
};
