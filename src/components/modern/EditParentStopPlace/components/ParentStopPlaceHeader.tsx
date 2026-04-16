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

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { Entities } from "../../../../models/Entities";
import { CenterMapButton, CopyIdButton, FavoriteButton } from "../../Shared";
import { ParentStopPlaceHeaderProps } from "../types";

/**
 * Header component for parent stop place editor
 * Matches EditStopPage header pattern: ArrowBack left, name+ID centre, actions right
 */
export const ParentStopPlaceHeader: React.FC<ParentStopPlaceHeaderProps> = ({
  stopPlace,
  originalStopPlace,
  onGoBack,
  onCollapse,
}) => {
  const { formatMessage } = useIntl();

  const headerText = stopPlace.id
    ? originalStopPlace.name
    : formatMessage({ id: "new_stop_title" });

  return (
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
      <Tooltip title={formatMessage({ id: "go_back" })}>
        <IconButton size="small" onClick={onGoBack}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>
          {headerText}
        </Typography>
        {stopPlace.topographicPlace && (
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            display="block"
          >
            {`${stopPlace.topographicPlace}, ${stopPlace.parentTopographicPlace}`}
          </Typography>
        )}
        {stopPlace.id && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.25, mt: -0.25 }}
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

      {onCollapse && (
        <Tooltip title={formatMessage({ id: "collapse" })}>
          <IconButton size="small" onClick={onCollapse}>
            <ExpandLessIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
