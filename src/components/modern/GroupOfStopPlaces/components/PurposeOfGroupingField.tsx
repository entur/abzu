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

import { MenuItem, TextField } from "@mui/material";
import { useIntl } from "react-intl";
import { StopPlacesGroupActions } from "../../../../actions";
import type { PurposeOfGroupingOption } from "../../../../actions/TiamatActions.modern";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { usePurposeOfGroupingOptions } from "../hooks/usePurposeOfGroupingOptions";

const TYPE_LABEL_PREFIX = "purpose_of_grouping_type_";

interface PurposeOfGroupingFieldProps {
  canEdit: boolean;
}

/**
 * The group's required "Formål med gruppering" (legacy parity). Missing in
 * the modern editor, so new groups got none and it couldn't be changed.
 * Like legacy, an empty value is flagged but doesn't block saving.
 */
export const PurposeOfGroupingField = ({
  canEdit,
}: PurposeOfGroupingFieldProps) => {
  const { formatMessage, messages } = useIntl();
  const dispatch = useAppDispatch();
  const options = usePurposeOfGroupingOptions();
  const purposeOfGrouping = useAppSelector(
    (state) =>
      (state as any).stopPlacesGroup?.current?.purposeOfGrouping as
        PurposeOfGroupingOption | null | undefined,
  );

  // Our own translation of Tiamat's value when we have one, else the value.
  const labelOf = (option: PurposeOfGroupingOption): string => {
    const key = `${TYPE_LABEL_PREFIX}${option.name?.value}`;
    if (messages[key]) return formatMessage({ id: key });
    return option.name?.value || option.id;
  };

  const handleChange = (id: string) => {
    const selected = options.find((option) => option.id === id) ?? null;
    dispatch(StopPlacesGroupActions.changePurposeOfGrouping(selected));
  };

  const selectedId = purposeOfGrouping?.id ?? "";
  // The saved value stays selectable while the options load.
  const shownOptions =
    purposeOfGrouping && !options.some((option) => option.id === selectedId)
      ? [purposeOfGrouping, ...options]
      : options;

  return (
    <TextField
      select
      label={formatMessage({ id: "purpose_of_grouping" })}
      value={selectedId}
      onChange={(event) => handleChange(event.target.value)}
      disabled={!canEdit}
      required
      error={!purposeOfGrouping}
      helperText={
        purposeOfGrouping
          ? ""
          : formatMessage({ id: "purpose_of_grouping_is_required" })
      }
      fullWidth
      size="small"
    >
      {shownOptions.map((option) => (
        <MenuItem key={option.id} value={option.id}>
          {labelOf(option)}
        </MenuItem>
      ))}
    </TextField>
  );
};
