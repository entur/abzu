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
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  ButtonBase,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";

const COORDINATE_DECIMALS = 6;

interface MarkerPopupDetailsProps {
  id?: string;
  lat: number;
  lng: number;
  /** When set, the coordinates can be clicked to type exact ones (F-76). */
  onEditCoordinates?: () => void;
}

/** The id (with copy) and coordinates line under a marker popup's title. */
export const MarkerPopupDetails = ({
  id,
  lat,
  lng,
  onEditCoordinates,
}: MarkerPopupDetailsProps) => {
  const { formatMessage } = useIntl();
  const coordinates = `${lat.toFixed(COORDINATE_DECIMALS)}, ${lng.toFixed(COORDINATE_DECIMALS)}`;

  const handleCopyId = () => {
    if (id) navigator.clipboard.writeText(id);
  };

  return (
    <>
      {id && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
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

      {onEditCoordinates ? (
        <Tooltip
          title={formatMessage({ id: "change_coordinates" })}
          placement="bottom"
        >
          <ButtonBase
            onClick={onEditCoordinates}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
              borderRadius: 0.5,
              textDecoration: "underline dotted",
              "&:hover": { color: "primary.main" },
            }}
          >
            <Typography variant="caption" color="inherit">
              {coordinates}
            </Typography>
            <EditIcon sx={{ fontSize: "0.85rem" }} />
          </ButtonBase>
        </Tooltip>
      ) : (
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block" }}
        >
          {coordinates}
        </Typography>
      )}
    </>
  );
};
