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

import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import { Box, Button, Divider, useTheme } from "@mui/material";
import { useIntl } from "react-intl";
import { ParentStopPlaceActionsProps } from "../types";

/**
 * Actions section for parent stop place
 * Contains Terminate, Undo, and Save buttons
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
  const theme = useTheme();
  const { formatMessage } = useIntl();

  // Can't save if:
  // - No name
  // - New stop with no children
  // - Not modified (unless expired)
  // - Can't edit
  const canSave =
    hasName && (hasId || hasChildren) && (isModified || hasExpired) && canEdit;

  // Can terminate if:
  // - Has ID (not new)
  // - Can delete
  // - Not already expired
  const canTerminate = hasId && canDelete && !hasExpired;

  // Can undo if modified or expired
  const canUndo = (isModified || hasExpired) && canEdit;

  return (
    <>
      <Divider />
      <Box
        sx={{
          display: "flex",
          gap: 1,
          p: 2,
          bgcolor: "background.paper",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          disabled={!canTerminate}
          onClick={onTerminate}
          sx={{
            flex: 1,
            textTransform: "none",
            fontSize: "0.75rem",
          }}
        >
          {formatMessage({ id: "terminate_stop_place" })}
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<UndoIcon />}
          disabled={!canUndo}
          onClick={onUndo}
          sx={{
            flex: 1,
            textTransform: "none",
            fontSize: "0.75rem",
          }}
        >
          {formatMessage({ id: "undo_changes" })}
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<SaveIcon />}
          disabled={!canSave}
          onClick={onSave}
          sx={{
            flex: 1,
            textTransform: "none",
            fontSize: "0.75rem",
          }}
        >
          {formatMessage({ id: "save_new_version" })}
        </Button>
      </Box>
    </>
  );
};
