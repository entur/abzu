/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *  https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Menu,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { ColumnOption } from "../types";

interface ColumnSelectorProps {
  columnOptions: ColumnOption[];
  buttonLabel: string;
  captionLabel: string;
  onColumnToggle: (id: string, checked: boolean) => void;
  onCheckAll: () => void;
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columnOptions,
  buttonLabel,
  captionLabel,
  onColumnToggle,
  onCheckAll,
}) => {
  const { formatMessage } = useIntl();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const allChecked = columnOptions.every((opt) => opt.checked);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {buttonLabel}
      </Button>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <Box
          sx={{
            px: 1,
            py: 0.5,
            bgcolor: "text.primary",
            color: "background.paper",
          }}
        >
          <Typography variant="caption" sx={{ textTransform: "capitalize" }}>
            {captionLabel}
          </Typography>
        </Box>
        {columnOptions.map((option) => (
          <Box key={option.id} sx={{ px: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={option.checked}
                  onChange={(_e, checked) => onColumnToggle(option.id, checked)}
                />
              }
              label={formatMessage({
                id: `report_columnNames_${option.id}`,
              })}
            />
          </Box>
        ))}
        <Divider />
        <Box sx={{ px: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={allChecked}
                onChange={() => onCheckAll()}
              />
            }
            label={formatMessage({ id: "all" })}
          />
        </Box>
      </Menu>
    </>
  );
};
