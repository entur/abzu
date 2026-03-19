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
import { CopyIdButton, FavoriteButton } from "../../Shared";
import { GroupOfStopPlacesHeaderProps } from "../types";

/**
 * Header component for group of stop places editor
 * Matches EditStopPage header pattern: ArrowBack left, name+ID centre, actions right
 */
export const GroupOfStopPlacesHeader: React.FC<
  GroupOfStopPlacesHeaderProps
> = ({ groupOfStopPlaces, onGoBack, onCollapse }) => {
  const { formatMessage } = useIntl();

  const headerText = groupOfStopPlaces.id
    ? groupOfStopPlaces.name
    : formatMessage({ id: "you_are_creating_group" });

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
        {groupOfStopPlaces.id && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.25, mt: -0.25 }}
          >
            <Typography variant="caption" color="text.secondary" noWrap>
              {groupOfStopPlaces.id}
            </Typography>
            <CopyIdButton idToCopy={groupOfStopPlaces.id} size="small" />
          </Box>
        )}
      </Box>

      {groupOfStopPlaces.id && (
        <FavoriteButton
          id={groupOfStopPlaces.id}
          name={groupOfStopPlaces.name}
          entityType={Entities.GROUP_OF_STOP_PLACE}
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
