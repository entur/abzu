/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import { Box, Button } from "@mui/material";
import { useIntl } from "react-intl";
import { StopPlace } from "../types";

interface StopPlaceActionBarProps {
  stopPlace: StopPlace;
  canEdit: boolean;
  canDelete: boolean;
  isModified: boolean;
  onOpenTerminateDialog: () => void;
  onOpenUndoDialog: () => void;
  onOpenSaveDialog: () => void;
}

/**
 * Terminate / undo / save for the stop place.
 *
 * Shared by the expanded panel and the collapsed bar: collapsing the panel must
 * not hide the fact that there are unsaved changes, nor the means to save them.
 * That was the core of the feedback about editing in a collapsed state.
 */
export const StopPlaceActionBar = ({
  stopPlace,
  canEdit,
  canDelete,
  isModified,
  onOpenTerminateDialog,
  onOpenUndoDialog,
  onOpenSaveDialog,
}: StopPlaceActionBarProps) => {
  const { formatMessage } = useIntl();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        px: 2,
        py: 1.5,
        bgcolor: "background.paper",
        flexWrap: "wrap",
        flexShrink: 0,
      }}
    >
      {stopPlace.id && canDelete && (
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={onOpenTerminateDialog}
        >
          {formatMessage({
            id: stopPlace.hasExpired
              ? "delete_stop_place"
              : "terminate_stop_place",
          })}
        </Button>
      )}
      {canEdit && (
        <>
          <Button
            variant="outlined"
            size="small"
            startIcon={<UndoIcon />}
            onClick={onOpenUndoDialog}
            disabled={!isModified}
            sx={{ ml: "auto" }}
          >
            {formatMessage({ id: "undo_changes" })}
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SaveIcon />}
            onClick={onOpenSaveDialog}
            disabled={!isModified || !stopPlace.name}
          >
            {formatMessage({ id: "save" })}
          </Button>
        </>
      )}
    </Box>
  );
};
