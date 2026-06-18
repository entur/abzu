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

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { FilterState } from "../types";

interface AdvancedFiltersMenuProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: unknown) => void;
}

export const AdvancedFiltersMenu: React.FC<AdvancedFiltersMenuProps> = ({
  filters,
  onFilterChange,
}) => {
  const { formatMessage } = useIntl();
  const [generalAnchorEl, setGeneralAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const [advancedAnchorEl, setAdvancedAnchorEl] = useState<HTMLElement | null>(
    null,
  );

  const menuItemStyle = { display: "flex", alignItems: "center" };

  return (
    <Box display="flex" gap={0.5} mt={0.5}>
      {/* General Filters */}
      <Button
        variant="contained"
        size="small"
        startIcon={<ExpandMoreIcon />}
        onClick={(e) => setGeneralAnchorEl(e.currentTarget)}
      >
        {formatMessage({ id: "filters_general" })}
      </Button>
      <Menu
        open={Boolean(generalAnchorEl)}
        anchorEl={generalAnchorEl}
        onClose={() => setGeneralAnchorEl(null)}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <MenuItem style={menuItemStyle}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.hasParking}
                onChange={(_e, value) => onFilterChange("hasParking", value)}
              />
            }
            label={formatMessage({ id: "has_parking" })}
          />
        </MenuItem>
      </Menu>

      {/* Advanced Filters */}
      <Button
        variant="contained"
        size="small"
        startIcon={<ExpandMoreIcon />}
        onClick={(e) => setAdvancedAnchorEl(e.currentTarget)}
      >
        {formatMessage({ id: "filters_admin" })}
      </Button>
      <Menu
        open={Boolean(advancedAnchorEl)}
        anchorEl={advancedAnchorEl}
        onClose={() => setAdvancedAnchorEl(null)}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <MenuItem style={menuItemStyle}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.showFutureAndExpired}
                onChange={(_e, value) =>
                  onFilterChange("showFutureAndExpired", value)
                }
              />
            }
            label={formatMessage({ id: "show_future_expired_and_terminated" })}
          />
        </MenuItem>
        <MenuItem style={menuItemStyle}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.withoutLocationOnly}
                onChange={(_e, value) =>
                  onFilterChange("withoutLocationOnly", value)
                }
              />
            }
            label={formatMessage({ id: "only_without_coordinates" })}
          />
        </MenuItem>
        <MenuItem style={menuItemStyle}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.withDuplicateImportedIds}
                onChange={(_e, value) =>
                  onFilterChange("withDuplicateImportedIds", value)
                }
              />
            }
            label={formatMessage({ id: "only_duplicate_importedIds" })}
          />
        </MenuItem>
        <MenuItem style={menuItemStyle}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.withNearbySimilarDuplicates}
                onChange={(_e, value) =>
                  onFilterChange("withNearbySimilarDuplicates", value)
                }
              />
            }
            label={formatMessage({ id: "with_nearby_similar_duplicates" })}
          />
        </MenuItem>
        <MenuItem style={menuItemStyle}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.withTags}
                onChange={(_e, value) => onFilterChange("withTags", value)}
              />
            }
            label={formatMessage({ id: "only_with_tags" })}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};
