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
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import { tourPopupZIndex } from "./tourLayers";

interface TourEndDialogProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/** "End the test tour?" — above the panel, like the tour's other popups. */
export const TourEndDialog = ({
  open,
  onConfirm,
  onClose,
}: TourEndDialogProps) => {
  const { formatMessage } = useIntl();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      sx={{ zIndex: tourPopupZIndex }}
    >
      <DialogTitle>
        {formatMessage({ id: "guided_tour_end_confirm_title" })}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          {formatMessage({ id: "guided_tour_end_confirm_body" })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{formatMessage({ id: "cancel" })}</Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          {formatMessage({ id: "guided_tour_end" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
