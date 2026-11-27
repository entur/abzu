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

import UploadFileIcon from "@mui/icons-material/UploadFileOutlined";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import { version as appVersion } from "../../../../package.json";
import { useTourFile } from "./hooks/useTourFile";
import { useTourSession } from "./hooks/useTourSession";
import { useTourStartDialogOpen } from "./hooks/useTourStartDialogOpen";
import { tourPopupZIndex } from "./tourLayers";
import { closeTourStartDialog } from "./tourStartDialogStore";
import { isSameTour, startTourSession } from "./tourSessionStore";

const TOUR_FILE_TYPES = ".json,application/json";

/** Pick a tour file, see what it contains, and start it. */
export const TourStartDialog = () => {
  const { formatMessage } = useIntl();
  const open = useTourStartDialogOpen();
  const session = useTourSession();
  const { fileName, result, onFileChosen, reset } = useTourFile();
  const tour = result && "tour" in result ? result.tour : null;
  const errors = result && "errors" in result ? result.errors : [];

  const handleClose = () => {
    reset();
    closeTourStartDialog();
  };

  const handleStart = () => {
    if (!tour) return;
    startTourSession(tour);
    handleClose();
  };

  const replacesOther =
    !!tour && !!session && session.tour.title !== tour.title;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: tourPopupZIndex }}
    >
      <DialogTitle>
        {formatMessage({ id: "guided_tour_start_title" })}
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="body2">
          {formatMessage({ id: "guided_tour_start_body" })}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileIcon />}
          >
            {formatMessage({ id: "guided_tour_choose_file" })}
            <input
              hidden
              type="file"
              accept={TOUR_FILE_TYPES}
              onChange={onFileChosen}
            />
          </Button>
          {fileName && <Typography variant="body2">{fileName}</Typography>}
        </Box>

        {errors.length > 0 && (
          <Alert severity="error">
            {formatMessage({ id: "guided_tour_file_errors" })}
            <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
              {errors.slice(0, 10).map((error) => (
                <li key={error}>{error}</li>
              ))}
            </Box>
          </Alert>
        )}

        {tour && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {tour.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {formatMessage(
                { id: "guided_tour_steps_count" },
                { count: tour.steps.length },
              )}
              {tour.branch &&
                ` · ${formatMessage({ id: "guided_tour_branch" }, { branch: tour.branch })}`}
            </Typography>
          </Box>
        )}
        {tour?.appVersion && tour.appVersion !== appVersion && (
          <Alert severity="warning">
            {formatMessage(
              { id: "guided_tour_version_warning" },
              { tourVersion: tour.appVersion, appVersion },
            )}
          </Alert>
        )}
        {replacesOther && (
          <Alert severity="warning">
            {formatMessage(
              { id: "guided_tour_replace_warning" },
              { title: session.tour.title },
            )}
          </Alert>
        )}
        {tour && session && !replacesOther && (
          <Alert severity="info">
            {formatMessage({ id: "guided_tour_resume_hint" })}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{formatMessage({ id: "cancel" })}</Button>
        <Button variant="contained" disabled={!tour} onClick={handleStart}>
          {formatMessage({ id: "guided_tour_start" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
