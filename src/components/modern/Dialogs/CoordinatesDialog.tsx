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
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import "../modern.css";
import {
  dialogCloseButton,
  dialogTitleContainer,
  dialogTitleText,
  formFieldContainer,
  formFieldDivider,
  formFieldLabel,
} from "../styles";
import { CoordinatesFarWarning } from "./CoordinatesFarWarning";
import {
  CoordinatesReference,
  useCoordinatesForm,
} from "./hooks/useCoordinatesForm";

interface CoordinatesDialogProps {
  open: boolean;
  coordinates?: string;
  titleId?: string;
  /** Text above the field; defaults to the "where do you want to go" wording. */
  bodyId?: string;
  /** Confirm button label; defaults to "Go". */
  confirmId?: string;
  /** Where the position is expected to be; far away needs a second confirm. */
  reference?: CoordinatesReference;
  handleConfirm: (position: [number, number]) => void;
  handleClose: () => void;
}

export const CoordinatesDialog: React.FC<CoordinatesDialogProps> = ({
  open,
  coordinates: initialCoordinates,
  titleId,
  bodyId,
  confirmId,
  reference,
  handleConfirm,
  handleClose,
}) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const { text, errorId, farWarning, setText, confirm, applySwapped, reset } =
    useCoordinatesForm(initialCoordinates, handleConfirm, reference);

  const onClose = () => {
    reset();
    handleClose();
  };

  const confirmLabelId = farWarning ? "continue_anyway" : confirmId || "go";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={dialogTitleContainer}>
        <Box component="span" sx={dialogTitleText}>
          {formatMessage({ id: titleId || "change_coordinates" })}
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={dialogCloseButton(theme)}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={formFieldContainer}>
          <Divider sx={formFieldDivider} />
          <Typography variant="body2" sx={formFieldLabel(theme)}>
            {formatMessage({ id: bodyId || "where_do_you_want_to_go" })}
          </Typography>

          <TextField
            fullWidth
            error={!!errorId}
            variant="outlined"
            placeholder="59.9139, 10.7522"
            label={formatMessage({ id: "coordinates" })}
            value={text}
            onChange={(event) => setText(event.target.value)}
            size="small"
            helperText={formatMessage({
              id: errorId ?? "coordinates_format_hint",
            })}
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Enter" && text) confirm();
            }}
          />

          {farWarning && reference && (
            <CoordinatesFarWarning
              warning={farWarning}
              referenceKind={reference.kind}
              onUseSwapped={applySwapped}
            />
          )}

          <Button
            variant="contained"
            onClick={confirm}
            disabled={!text}
            fullWidth
            sx={{ mt: 1.5 }}
          >
            {formatMessage({ id: confirmLabelId })}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
