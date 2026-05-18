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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";

interface Props {
  open: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export const NewParentStopWizard = ({ open, onConfirm, onCancel }: Props) => {
  const { formatMessage } = useIntl();
  const [name, setName] = useState("");

  const canConfirm = name.trim().length > 0;

  const handleConfirm = () => {
    onConfirm(name.trim());
  };

  const handleCancel = () => {
    setName("");
    onCancel();
  };

  return (
    <Dialog open={open} maxWidth="xs" fullWidth disableEscapeKeyDown>
      <DialogTitle>
        {formatMessage({ id: "new_stop_wizard_multimodal_title" })}
      </DialogTitle>
      <DialogContent sx={{ pt: "16px !important" }}>
        <TextField
          label={formatMessage({ id: "new_stop_wizard_name_label" })}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          fullWidth
          size="small"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          {formatMessage({ id: "cancel" })}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!canConfirm}
        >
          {formatMessage({ id: "new_stop_wizard_confirm" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
