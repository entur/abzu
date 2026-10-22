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

import { TextField } from "@mui/material";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import { useConfig } from "../../../../config/ConfigContext";
import { useAppDispatch } from "../../../../store/hooks";
import { DirtyLabel } from "../ElementStatus";
import { useIsStopFieldDirty } from "./hooks/useIsStopFieldDirty";

interface StopUrlFieldProps {
  url?: string | null;
  canEdit: boolean;
}

/**
 * The stop's URL, behind the `StopPlaceUrl` feature flag as in legacy. A
 * deployment that turns the flag on edits URLs on monomodal stops, which the
 * modern editor didn't offer.
 */
export const StopUrlField = ({ url, canEdit }: StopUrlFieldProps) => {
  const { formatMessage } = useIntl();
  const { featureFlags } = useConfig();
  const dispatch = useAppDispatch();
  const isDirty = useIsStopFieldDirty();

  if (!featureFlags?.StopPlaceUrl) return null;

  return (
    <TextField
      label={
        <DirtyLabel dirty={isDirty("url")}>
          {formatMessage({ id: "url" })}
        </DirtyLabel>
      }
      value={url || ""}
      onChange={(event) =>
        dispatch(StopPlaceActions.changeStopUrl(event.target.value))
      }
      disabled={!canEdit}
      fullWidth
      size="small"
      variant="outlined"
    />
  );
};
