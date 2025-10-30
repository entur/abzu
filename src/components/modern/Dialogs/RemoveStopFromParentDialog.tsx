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

import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";

export interface RemoveStopFromParentDialogProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  stopPlaceId?: string;
  isLastChild?: boolean;
  isLoading?: boolean;
}

export const RemoveStopFromParentDialog: React.FC<
  RemoveStopFromParentDialogProps
> = ({
  open,
  handleClose,
  handleConfirm,
  stopPlaceId,
  isLastChild,
  isLoading,
}) => {
  const { formatMessage } = useIntl();
  const [changesUnderstood, setChangesUnderstood] = useState(false);

  const handleCloseDialog = () => {
    setChangesUnderstood(false);
    handleClose();
  };

  const confirmDisabled = isLoading || (isLastChild && !changesUnderstood);

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {formatMessage({ id: "remove_stop_from_parent_title" })}
        </Typography>
        <IconButton onClick={handleCloseDialog} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
            {stopPlaceId}
          </Typography>

          <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2 }}>
            {formatMessage({ id: "remove_stop_from_parent_info" })}
          </Alert>

          {isLastChild && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="error" icon={<WarningIcon />}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {formatMessage({ id: "last_child_warning_first" })}
                </Typography>
                <Typography variant="body2">
                  {formatMessage({ id: "last_child_warning_second" })}
                </Typography>
              </Alert>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={changesUnderstood}
                    onChange={(e) => setChangesUnderstood(e.target.checked)}
                  />
                }
                label={formatMessage({ id: "changes_understood" })}
                sx={{ mt: 1 }}
              />
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={handleCloseDialog}>
              {formatMessage({ id: "cancel" })}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirm}
              disabled={confirmDisabled}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {formatMessage({ id: "confirm" })}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
