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

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, IconButton, Popover, Tooltip, Typography } from "@mui/material";
import { useIntl } from "react-intl";

interface MarkerPopupProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  title: string;
  id?: string;
  lat: number;
  lng: number;
  minWidth?: number;
  children?: React.ReactNode;
}

export const MarkerPopup = ({
  anchorEl,
  onClose,
  title,
  id,
  lat,
  lng,
  minWidth = 200,
  children,
}: MarkerPopupProps) => {
  const { formatMessage } = useIntl();

  const handleCopyId = () => {
    if (id) navigator.clipboard.writeText(id);
  };

  return (
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      transformOrigin={{ vertical: "bottom", horizontal: "center" }}
      disableRestoreFocus
      sx={{ "& .MuiPopover-paper": { borderRadius: 2, minWidth } }}
    >
      <Box sx={{ p: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, mb: 0.5, color: "primary.main" }}
        >
          {title}
        </Typography>

        {id && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {id}
            </Typography>
            <Tooltip title={formatMessage({ id: "copy_id" })} placement="top">
              <IconButton size="small" onClick={handleCopyId} sx={{ p: 0.25 }}>
                <ContentCopyIcon sx={{ fontSize: "0.85rem" }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block" }}
        >
          {lat.toFixed(6)}, {lng.toFixed(6)}
        </Typography>

        {children}
      </Box>
    </Popover>
  );
};
