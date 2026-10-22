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

import { Box, TextField } from "@mui/material";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import { useConfig } from "../../../../config/ConfigContext";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { DirtyLabel } from "../ElementStatus";
import { useIsStopFieldDirty } from "./hooks/useIsStopFieldDirty";

interface StopPostalAddress {
  postalAddressAddressLine1?: string;
  postalAddressTown?: string;
  postalAddressPostCode?: string;
}

interface StopPostalAddressFieldsProps {
  canEdit: boolean;
}

const FIELDS = [
  {
    key: "postalAddressAddressLine1",
    labelId: "postalAddress_addressLine1",
    change: StopPlaceActions.changeStopPostalAddressAddressLine1,
  },
  {
    key: "postalAddressTown",
    labelId: "postalAddress_town",
    change: StopPlaceActions.changeStopPostalAddressTown,
  },
  {
    key: "postalAddressPostCode",
    labelId: "postalAddress_postCode",
    change: StopPlaceActions.changeStopPostalAddressPostCode,
  },
] as const;

/**
 * Postal address (address line, town, post code) of a stop or multimodal
 * stop, behind the `StopPlacePostalAddress` feature flag as in legacy. Used
 * in production by a deployment that has the flag on. Reads the open stop
 * from Redux, so both editors can place it without passing the address down.
 */
export const StopPostalAddressFields = ({
  canEdit,
}: StopPostalAddressFieldsProps) => {
  const { formatMessage } = useIntl();
  const { featureFlags } = useConfig();
  const dispatch = useAppDispatch();
  const isDirty = useIsStopFieldDirty();
  const address = useAppSelector(
    (state) => (state.stopPlace.current ?? {}) as StopPostalAddress,
  );

  if (!featureFlags?.StopPlacePostalAddress) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {FIELDS.map(({ key, labelId, change }) => (
        <TextField
          key={key}
          label={
            <DirtyLabel dirty={isDirty(key)}>
              {formatMessage({ id: labelId })}
            </DirtyLabel>
          }
          value={address[key] || ""}
          onChange={(event) => dispatch(change(event.target.value))}
          disabled={!canEdit}
          fullWidth
          size="small"
          variant="outlined"
        />
      ))}
    </Box>
  );
};
