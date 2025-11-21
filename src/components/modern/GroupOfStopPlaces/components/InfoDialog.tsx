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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useIntl } from "react-intl";
import { CopyIdButton } from "../../Shared";

export interface InfoDialogProps {
  open: boolean;
  name?: string;
  id: string;
  centerPosition?: [number, number];
  created?: string;
  modified?: string;
  version?: string;
  onClose: () => void;
}

/**
 * Dialog for displaying group of stop places metadata
 */
export const InfoDialog: React.FC<InfoDialogProps> = ({
  open,
  name,
  id,
  centerPosition,
  created,
  modified,
  version,
  onClose,
}) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formatDate = (dateString?: string) => {
    if (!dateString) return formatMessage({ id: "not_available" });
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  const formatCoordinates = (coords?: [number, number]) => {
    if (!coords || coords.length !== 2) {
      return formatMessage({ id: "not_available" });
    }
    return `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 1,
        }}
      >
        {formatMessage({ id: "information" })}
        <IconButton
          edge="end"
          onClick={onClose}
          aria-label={formatMessage({ id: "close" })}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          {/* Name */}
          {name && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                {formatMessage({ id: "name" })}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {name}
              </Typography>
            </Box>
          )}

          {/* ID with Copy Button */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              {formatMessage({ id: "id" })}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.9em",
                  wordBreak: "break-all",
                }}
              >
                {id}
              </Typography>
              <CopyIdButton idToCopy={id} size="small" />
            </Box>
          </Box>

          {/* Coordinates */}
          {centerPosition && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                {formatMessage({ id: "coordinates" })}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontFamily: "monospace", fontSize: "0.9em" }}
              >
                {formatCoordinates(centerPosition)}
              </Typography>
            </Box>
          )}

          {/* Created Date */}
          {created && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                {formatMessage({ id: "created" })}
              </Typography>
              <Typography variant="body1">{formatDate(created)}</Typography>
            </Box>
          )}

          {/* Modified Date */}
          {modified && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                {formatMessage({ id: "modified" })}
              </Typography>
              <Typography variant="body1">{formatDate(modified)}</Typography>
            </Box>
          )}

          {/* Version */}
          {version && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                {formatMessage({ id: "version" })}
              </Typography>
              <Typography variant="body1">{version}</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
