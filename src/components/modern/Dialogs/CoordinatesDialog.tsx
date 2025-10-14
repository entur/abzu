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
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { extractCoordinates } from "../../../utils/";

interface CoordinatesDialogProps {
  open: boolean;
  coordinates?: string;
  titleId?: string;
  handleConfirm: (position: [number, number]) => void;
  handleClose: () => void;
}

export const CoordinatesDialog: React.FC<CoordinatesDialogProps> = ({
  open,
  coordinates: initialCoordinates,
  titleId,
  handleConfirm,
  handleClose,
}) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const [coordinates, setCoordinates] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCoordinates(event.target.value);
  };

  const onClose = () => {
    setCoordinates("");
    setErrorText("");
    handleClose();
  };

  const onConfirm = () => {
    const coordinatesString = coordinates || initialCoordinates;
    if (typeof coordinatesString === "undefined") return;

    const position = extractCoordinates(coordinatesString);

    if (position) {
      handleConfirm(position);
      setCoordinates("");
      setErrorText("");
    } else {
      setErrorText(
        formatMessage({
          id: "change_coordinates_invalid",
        }),
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 1 }}>
        <Box component="span" sx={{ flex: 1 }}>
          {formatMessage({ id: titleId || "change_coordinates" })}
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ px: 2, py: 1 }}>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              mb: 1.5,
              color: theme.palette.text.secondary,
            }}
          >
            {formatMessage({ id: "where_do_you_want_to_go" }) ||
              "Where do you want to go?"}
          </Typography>

          <TextField
            fullWidth
            error={!!errorText}
            variant="outlined"
            placeholder="59.9139, 10.7522"
            label={formatMessage({ id: "coordinates" })}
            value={coordinates || initialCoordinates || ""}
            onChange={handleInputChange}
            size="small"
            helperText={
              errorText ||
              formatMessage({ id: "coordinates_format_hint" }) ||
              "Format: latitude, longitude"
            }
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && (coordinates || initialCoordinates)) {
                onConfirm();
              }
            }}
          />

          <Button
            variant="contained"
            onClick={onConfirm}
            disabled={!coordinates && !initialCoordinates}
            fullWidth
            sx={{ mt: 1.5 }}
          >
            {formatMessage({ id: "go" }) || "Go"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
