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

import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import { Box, Button, Divider } from "@mui/material";
import { useIntl } from "react-intl";
import { ParentStopPlaceActionsProps } from "../types";

/**
 * Actions section for parent stop place
 * Matches EditStopPage footer pattern: Terminate left, Undo+Save right
 */
export const ParentStopPlaceActions: React.FC<ParentStopPlaceActionsProps> = ({
  hasId,
  isModified,
  canEdit,
  canDelete,
  hasName,
  hasExpired,
  hasChildren,
  onTerminate,
  onUndo,
  onSave,
}) => {
  const { formatMessage } = useIntl();

  const isSaveDisabled =
    !hasName ||
    (!hasId && !hasChildren) ||
    (!isModified && !hasExpired) ||
    !canEdit;

  const isUndoDisabled = (!isModified && !hasExpired) || !canEdit;
  const isTerminateDisabled = !canDelete || hasExpired;

  return (
    <>
      <Divider />
      <Box
        sx={{
          display: "flex",
          gap: 1,
          px: 2,
          py: 1.5,
          bgcolor: "background.paper",
          flexWrap: "wrap",
        }}
      >
        {hasId && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={onTerminate}
            disabled={isTerminateDisabled}
          >
            {formatMessage({
              id: hasExpired ? "delete_stop_place" : "terminate_stop_place",
            })}
          </Button>
        )}
        {canEdit && (
          <>
            <Button
              variant="outlined"
              size="small"
              startIcon={<UndoIcon />}
              onClick={onUndo}
              disabled={isUndoDisabled}
              sx={{ ml: "auto" }}
            >
              {formatMessage({ id: "undo_changes" })}
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<SaveIcon />}
              onClick={onSave}
              disabled={isSaveDisabled}
            >
              {formatMessage({ id: "save" })}
            </Button>
          </>
        )}
      </Box>
    </>
  );
};
