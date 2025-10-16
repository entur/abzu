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

import { Close as CloseIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { InitialMapSettingsForm } from "../Header/components";
import "../modern.css";
import {
  dialogCloseButton,
  dialogTitleContainer,
  dialogTitleText,
} from "../styles";

interface DefaultMapSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const DefaultMapSettingsDialog: React.FC<
  DefaultMapSettingsDialogProps
> = ({ open, onClose }) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={dialogTitleContainer}>
        <Typography variant="h6" sx={dialogTitleText}>
          {formatMessage({ id: "default_map_location" }) ||
            "Default map location"}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={dialogCloseButton(theme)}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {formatMessage({ id: "default_map_settings_description" }) ||
            "Configure the initial map position and zoom level when opening the application."}
        </Typography>
        <InitialMapSettingsForm onSave={onClose} />
      </DialogContent>
    </Dialog>
  );
};
