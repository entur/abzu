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
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { InitialMapSettingsForm } from "../Header/components/InitialMapSettingsForm";

interface DefaultMapSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const DefaultMapSettingsDialog: React.FC<
  DefaultMapSettingsDialogProps
> = ({ open, onClose }) => {
  const { formatMessage } = useIntl();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {formatMessage({ id: "default_map_settings" }) ||
            "Default Map Settings"}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {formatMessage({ id: "default_map_settings_description" }) ||
            "Configure the initial map position and zoom level when opening the application."}
        </Typography>
        <InitialMapSettingsForm />
      </DialogContent>
    </Dialog>
  );
};
