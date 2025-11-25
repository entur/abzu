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
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { ConfirmDialog } from "../ConfirmDialog";
import { AltNameForm } from "./components/AltNameForm";
import { AltNamesList } from "./components/AltNamesList";
import { useAltNamesState } from "./hooks/useAltNamesState";
import { AltNamesDialogProps } from "./types";

/**
 * Dialog for managing alternative names
 * Refactored into smaller components and hooks for better maintainability
 */
export const AltNamesDialog: React.FC<AltNamesDialogProps> = ({
  open,
  handleClose,
  altNames = [],
  disabled,
}) => {
  const { formatMessage } = useIntl();

  const {
    state,
    confirmDialogOpen,
    updateStateField,
    handleAddAltName,
    handleEditAltName,
    handleRemoveName,
    handleStartEdit,
    handleCancelEdit,
    handleAddPendingAltName,
    handleCloseConfirmDialog,
  } = useAltNamesState(altNames);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 1 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            {formatMessage({ id: "alternative_names" })}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {/* List of existing alternative names */}
            <AltNamesList
              altNames={altNames}
              disabled={disabled}
              onEdit={handleStartEdit}
              onRemove={handleRemoveName}
            />

            {/* Add/Edit form */}
            <AltNameForm
              state={state}
              disabled={disabled}
              onFieldChange={updateStateField}
              onAdd={handleAddAltName}
              onEdit={handleEditAltName}
              onCancel={handleCancelEdit}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Conflict confirmation dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        title={formatMessage({ id: "overwrite_alt_name_title" })}
        body={formatMessage({ id: "overwrite_alt_name_body" })}
        confirmText={formatMessage({ id: "overwrite_alt_name_confirm" })}
        cancelText={formatMessage({ id: "overwrite_alt_name_cancel" })}
        onConfirm={handleAddPendingAltName}
        onClose={handleCloseConfirmDialog}
      />
    </>
  );
};
