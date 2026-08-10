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
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { Entities } from "../../../../models/Entities";
import { CenterMapButton, CopyIdButton, FavoriteButton } from "../../Shared";
import { GroupOfStopPlacesHeaderProps, GroupTopographicPlace } from "../types";

/**
 * Header component for group of stop places editor.
 * Shared between the full expanded drawer and the collapsed MinimizedBar
 * (via its customHeader slot), matching StopPlaceHeader's contract.
 */
export const GroupOfStopPlacesHeader: React.FC<
  GroupOfStopPlacesHeaderProps
> = ({ groupOfStopPlaces, centerPosition, onGoBack, onToggle, isExpanded }) => {
  const { formatMessage } = useIntl();

  const headerText = groupOfStopPlaces.id
    ? groupOfStopPlaces.name
    : formatMessage({ id: "you_are_creating_group" });

  // A group spans its members' municipalities, so this is a list rather than
  // the single value StopPlaceHeader/ParentStopPlaceHeader show. Keep the
  // header on one line: first place inline, the rest behind a "+N" tooltip.
  const [firstPlace, ...otherPlaces] =
    groupOfStopPlaces.topographicPlaces ?? [];
  const formatPlace = (place: GroupTopographicPlace) =>
    `${place.topographicPlace}, ${place.parentTopographicPlace}`;

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
      <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
        <GroupWorkIcon sx={{ fontSize: "1.3rem" }} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>
          {headerText}
        </Typography>
        {firstPlace && (
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ display: "block" }}
          >
            {formatPlace(firstPlace)}
            {otherPlaces.length > 0 && (
              <Tooltip
                title={otherPlaces.map((place) => (
                  <Box key={formatPlace(place)}>{formatPlace(place)}</Box>
                ))}
              >
                <Box
                  component="span"
                  sx={{
                    ml: 0.5,
                    borderBottom: "1px dotted",
                    cursor: "default",
                  }}
                >
                  {`+${otherPlaces.length}`}
                </Box>
              </Tooltip>
            )}
          </Typography>
        )}
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

      <CenterMapButton location={centerPosition} />
      {groupOfStopPlaces.id && (
        <FavoriteButton
          id={groupOfStopPlaces.id}
          name={groupOfStopPlaces.name}
          entityType={Entities.GROUP_OF_STOP_PLACE}
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
  );
};
