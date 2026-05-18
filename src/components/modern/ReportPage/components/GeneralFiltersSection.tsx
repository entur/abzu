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
  Checkbox,
  Divider,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import { FilterState } from "../types";

interface GeneralFiltersSectionProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: unknown) => void;
}

const FilterCheckbox: React.FC<{
  checked: boolean;
  labelId: string;
  onChange: (_e: React.SyntheticEvent, checked: boolean) => void;
}> = ({ checked, labelId, onChange }) => {
  const { formatMessage } = useIntl();
  return (
    <FormControlLabel
      sx={{ ml: 0 }}
      control={<Checkbox size="small" checked={checked} onChange={onChange} />}
      label={
        <Typography variant="body2">
          {formatMessage({ id: labelId })}
        </Typography>
      }
    />
  );
};

export const GeneralFiltersSection: React.FC<GeneralFiltersSectionProps> = ({
  filters,
  onFilterChange,
}) => {
  const { formatMessage } = useIntl();

  const sectionLabel = (labelId: string) => (
    <Typography
      variant="caption"
      fontWeight={600}
      display="block"
      mb={0.5}
      color="text.secondary"
      textTransform="uppercase"
      letterSpacing={0.5}
    >
      {formatMessage({ id: labelId })}
    </Typography>
  );

  return (
    <>
      {sectionLabel("filters_general")}
      <FilterCheckbox
        checked={filters.hasParking}
        labelId="has_parking"
        onChange={(_e, v) => onFilterChange("hasParking", v)}
      />
      <FilterCheckbox
        checked={filters.showFutureAndExpired}
        labelId="show_future_expired_and_terminated"
        onChange={(_e, v) => onFilterChange("showFutureAndExpired", v)}
      />

      <Divider sx={{ my: 2 }} />

      {sectionLabel("filters_admin")}
      <FilterCheckbox
        checked={filters.withoutLocationOnly}
        labelId="only_without_coordinates"
        onChange={(_e, v) => onFilterChange("withoutLocationOnly", v)}
      />
      <FilterCheckbox
        checked={filters.withDuplicateImportedIds}
        labelId="only_duplicate_importedIds"
        onChange={(_e, v) => onFilterChange("withDuplicateImportedIds", v)}
      />
      <FilterCheckbox
        checked={filters.withNearbySimilarDuplicates}
        labelId="with_nearby_similar_duplicates"
        onChange={(_e, v) => onFilterChange("withNearbySimilarDuplicates", v)}
      />
      <FilterCheckbox
        checked={filters.withTags}
        labelId="only_with_tags"
        onChange={(_e, v) => onFilterChange("withTags", v)}
      />

      <Box sx={{ pb: 1 }} />
    </>
  );
};
