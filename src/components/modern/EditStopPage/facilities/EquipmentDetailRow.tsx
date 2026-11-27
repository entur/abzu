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

import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import type { DetailAnswer } from "./equipmentDetails";

const YES = "yes";
const ICON_SIZE = 20;
const NO = "no";

interface EquipmentDetailRowProps {
  icon: React.ReactElement;
  labelId: string;
  answer: DetailAnswer;
  disabled: boolean;
  onChange: (answer: DetailAnswer) => void;
}

/**
 * One detail, e.g. "Sitteplasser: Ja / Nei" (F-25). Neither selected means
 * not set; clicking the selected answer again clears it.
 */
export const EquipmentDetailRow = ({
  icon,
  labelId,
  answer,
  disabled,
  onChange,
}: EquipmentDetailRowProps) => {
  const { formatMessage } = useIntl();
  const label = formatMessage({ id: labelId });
  const selected = answer === null ? null : answer ? YES : NO;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.5 }}>
      <Box
        sx={{
          display: "flex",
          color: "text.primary",
          "& svg": { width: ICON_SIZE, height: ICON_SIZE },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2">{label}</Typography>
        {answer === null && (
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {formatMessage({ id: "detail_not_set" })}
          </Typography>
        )}
      </Box>
      <ToggleButtonGroup
        exclusive
        size="small"
        color="primary"
        value={selected}
        disabled={disabled}
        aria-label={label}
        onChange={(_event, value: string | null) =>
          onChange(value === null ? null : value === YES)
        }
      >
        <ToggleButton value={YES} sx={{ py: 0.25, px: 1.25 }}>
          {formatMessage({ id: "answer_yes" })}
        </ToggleButton>
        <ToggleButton value={NO} sx={{ py: 0.25, px: 1.25 }}>
          {formatMessage({ id: "answer_no" })}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
