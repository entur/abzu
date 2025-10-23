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
import { GroupOfStopPlacesActionsProps } from "../types";

/**
 * Action buttons component for group of stop places
 * Shows Remove, Undo, and Save buttons
 */
export const GroupOfStopPlacesActions: React.FC<
  GroupOfStopPlacesActionsProps
> = ({
  hasId,
  isModified,
  canEdit,
  canDelete,
  hasName,
  onRemove,
  onUndo,
  onSave,
}) => {
  const { formatMessage } = useIntl();

  const isSaveDisabled = !isModified || !hasName || !canEdit;
  const isUndoDisabled = !isModified || !canEdit;
  const isRemoveDisabled = !canDelete;

  return (
    <>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          gap: 1,
          p: 1.5,
          bgcolor: "background.paper",
        }}
      >
        {hasId && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={onRemove}
            disabled={isRemoveDisabled}
            sx={{ flex: 1 }}
          >
            {formatMessage({ id: "remove" })}
          </Button>
        )}
        <Button
          variant="outlined"
          size="small"
          startIcon={<UndoIcon />}
          onClick={onUndo}
          disabled={isUndoDisabled}
          sx={{ flex: 1 }}
        >
          {formatMessage({ id: "undo_changes" })}
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<SaveIcon />}
          onClick={onSave}
          disabled={isSaveDisabled}
          sx={{ flex: 1 }}
        >
          {formatMessage({ id: "save" })}
        </Button>
      </Box>
    </>
  );
};
