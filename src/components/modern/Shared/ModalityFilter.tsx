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

import { Checkbox } from "@mui/material";
import React from "react";
import stopTypes from "../../../models/stopTypes";
import { getSvgIconByTypeOrSubmode } from "../../../utils/iconUtils";

const STOP_TYPE_KEYS = Object.keys(stopTypes);

interface ModalityFilterProps {
  stopTypeFilter: string[];
  handleApplyFilters: (filters: string[]) => void;
  /** Accepted for API compatibility but not used. */
  locale?: string;
}

const ModalityIcon = ({ type, faded }: { type: string; faded: boolean }) => (
  <img
    alt=""
    src={getSvgIconByTypeOrSubmode(undefined, type)}
    style={{ width: 20, height: 20, opacity: faded ? 0.3 : 1 }}
  />
);

const ModalityFilterInner = ({
  stopTypeFilter,
  handleApplyFilters,
}: ModalityFilterProps) => {
  const handleToggle = (type: string, checked: boolean) => {
    let next = stopTypeFilter.slice();

    if (checked) {
      next.push(type);
      // All modalities selected = no filter (show everything)
      if (next.length === STOP_TYPE_KEYS.length) {
        next = [];
      }
    } else {
      if (!next.length) {
        // No active filter means all are shown — deselecting one isolates it
        next = [type];
      } else {
        next = next.filter((t) => t !== type);
      }
    }

    handleApplyFilters(next);
  };

  return (
    <div
      style={{ display: "flex", padding: 8, justifyContent: "space-between" }}
    >
      {STOP_TYPE_KEYS.map((type) => {
        const checked =
          stopTypeFilter.includes(type) || stopTypeFilter.length === 0;
        return (
          <div key={type}>
            <Checkbox
              checked={checked}
              onChange={(_, value) => handleToggle(type, value)}
              style={{ width: "auto" }}
              checkedIcon={<ModalityIcon type={type} faded={false} />}
              icon={<ModalityIcon type={type} faded={true} />}
            />
          </div>
        );
      })}
    </div>
  );
};

export const ModalityFilter = React.memo(ModalityFilterInner);
