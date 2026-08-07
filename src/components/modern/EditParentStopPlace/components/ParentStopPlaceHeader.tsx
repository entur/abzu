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
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinkIcon from "@mui/icons-material/Link";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { Entities } from "../../../../models/Entities";
import { CenterMapButton, CopyIdButton, FavoriteButton } from "../../Shared";
import { ParentStopPlaceHeaderProps } from "../types";

/**
 * Header component for parent stop place editor.
 * Shared between the full expanded drawer and the collapsed MinimizedBar
 * (via its customHeader slot), matching StopPlaceHeader's contract.
 */
export const ParentStopPlaceHeader: React.FC<ParentStopPlaceHeaderProps> = ({
  stopPlace,
  originalStopPlace,
  onGoBack,
  onToggle,
  isExpanded,
}) => {
  const { formatMessage } = useIntl();

  const headerText = stopPlace.id
    ? originalStopPlace.name
    : formatMessage({ id: "new_stop_title" });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1,
          py: 0.5,
          minHeight: 48,
          gap: 0.5,
        }}
      >
        <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          <LinkIcon sx={{ fontSize: "1.3rem" }} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>
            {headerText}
          </Typography>
          {stopPlace.topographicPlace && (
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ display: "block" }}
            >
              {`${stopPlace.topographicPlace}, ${stopPlace.parentTopographicPlace}`}
            </Typography>
          )}
          {stopPlace.id && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.25,
                mt: -0.25,
              }}
            >
              <Typography variant="caption" color="text.secondary" noWrap>
                {stopPlace.id}
              </Typography>
              <CopyIdButton idToCopy={stopPlace.id} size="small" />
            </Box>
          )}
        </Box>

        <CenterMapButton location={stopPlace.location} />
        {stopPlace.id && (
          <FavoriteButton
            id={stopPlace.id}
            name={originalStopPlace.name}
            entityType={Entities.STOP_PLACE}
            isParent={true}
            topographicPlace={stopPlace.topographicPlace}
            parentTopographicPlace={stopPlace.parentTopographicPlace}
            location={stopPlace.position}
          />
        )}

        <Tooltip
          title={formatMessage({ id: isExpanded ? "collapse" : "expand" })}
        >
          <IconButton size="small" onClick={onToggle}>
            {isExpanded ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title={formatMessage({ id: "close" })}>
          <IconButton size="small" onClick={onGoBack}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {stopPlace.hasExpired && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            py: 0.5,
            bgcolor: "warning.main",
            color: "warning.contrastText",
          }}
        >
          <WarningAmberIcon sx={{ fontSize: "1rem", color: "inherit" }} />
          <Typography
            variant="caption"
            color="inherit"
            sx={{ fontWeight: 500 }}
          >
            {formatMessage({ id: "stop_has_expired_last_version" })}
          </Typography>
        </Box>
      )}
    </>
  );
};
