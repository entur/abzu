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
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { DirtyLabel } from "../../Shared/ElementStatus";
import { useIsStopFieldDirty } from "../../Shared/StopDetails/hooks/useIsStopFieldDirty";

interface StopPlaceCodesFieldsProps {
  publicCode?: string;
  privateCode?: string;
  canEdit: boolean;
}

/**
 * The stop's own public and private code, shown when the user turns on
 * "public/private code on stop places" in the settings (legacy parity). The
 * setting existed in the modern UI but had no effect.
 */
export const StopPlaceCodesFields = ({
  publicCode,
  privateCode,
  canEdit,
}: StopPlaceCodesFieldsProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const isDirty = useIsStopFieldDirty();
  const isEnabled = useAppSelector(
    (state) =>
      !!(state.stopPlace as any).enablePublicCodePrivateCodeOnStopPlaces,
  );

  if (!isEnabled) return null;

  return (
    <Box sx={{ display: "flex", gap: 1.5 }}>
      <TextField
        label={
          <DirtyLabel dirty={isDirty("publicCode")}>
            {formatMessage({ id: "publicCode" })}
          </DirtyLabel>
        }
        value={publicCode || ""}
        onChange={(event) =>
          dispatch(StopPlaceActions.changeStopPublicCode(event.target.value))
        }
        disabled={!canEdit}
        fullWidth
        size="small"
        variant="outlined"
      />
      <TextField
        label={
          <DirtyLabel dirty={isDirty("privateCode")}>
            {formatMessage({ id: "privateCode" })}
          </DirtyLabel>
        }
        value={privateCode || ""}
        onChange={(event) =>
          dispatch(StopPlaceActions.changeStopPrivateCode(event.target.value))
        }
        disabled={!canEdit}
        fullWidth
        size="small"
        variant="outlined"
      />
    </Box>
  );
};
