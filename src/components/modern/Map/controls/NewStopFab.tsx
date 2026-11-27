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

import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { Fab, Tooltip } from "@mui/material";
import { useIntl } from "react-intl";
import { addElementFabSx, FAB_TOP } from "./utils/addElementFabSx";

interface NewStopFabProps {
  left: number;
  isPlacing: boolean;
  onStart: () => void;
  onCancel: () => void;
}

/** With no stop open, the + starts placing a new stop; while placing it cancels. */
export const NewStopFab = ({
  left,
  isPlacing,
  onStart,
  onCancel,
}: NewStopFabProps) => {
  const { formatMessage } = useIntl();
  const label = formatMessage({
    id: isPlacing ? "cancel" : "map_add_stop_place",
  });

  return (
    // Below, so it never covers the placement hint docked to the right.
    <Tooltip title={label} placement="bottom">
      <Fab
        aria-label={label}
        onClick={isPlacing ? onCancel : onStart}
        sx={{
          position: "absolute",
          top: FAB_TOP,
          left,
          ...addElementFabSx(isPlacing),
        }}
      >
        {isPlacing ? <CloseIcon /> : <AddIcon />}
      </Fab>
    </Tooltip>
  );
};
