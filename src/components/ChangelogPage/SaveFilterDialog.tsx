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

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useIntl } from "react-intl";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (title: string) => void;
}

export const SaveFilterDialog = ({ open, onClose, onConfirm }: Props) => {
  const { formatMessage } = useIntl();
  const [titleText, setTitleText] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!titleText.trim()) {
      setError(formatMessage({ id: "field_is_required" }));
      return;
    }
    onConfirm(titleText.trim());
    setTitleText("");
    setError("");
  };

  const handleClose = () => {
    onClose();
    setTitleText("");
    setError("");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {formatMessage({ id: "changelog_save_filter_title" })}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          value={titleText}
          onChange={(e) => {
            setTitleText(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConfirm();
          }}
          error={Boolean(error)}
          helperText={error}
          variant="outlined"
          size="small"
          style={{ marginTop: 8 }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="secondary" onClick={handleClose}>
          {formatMessage({ id: "cancel" })}
        </Button>
        <Button variant="text" onClick={handleConfirm}>
          {formatMessage({ id: "use" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
