/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { Entities } from "../../../../models/Entities";
import ModalityIconImg from "../../../MainPage/ModalityIconImg";
import { CenterMapButton, CopyIdButton, FavoriteButton } from "../../Shared";
import {
  hasChangedKey,
  useElementStatusEnabled,
  UnsavedDot,
  useStopPlaceDirtyKeys,
} from "../../Shared/ElementStatus";
import { StopPlace } from "../types";

/** The header owns no fields of its own; it mirrors the stop place name. */
const HEADER_NAME_KEYS = ["name"] as const;

const NAME_FONT_SIZE_SHORT = "1.5rem";
const NAME_FONT_SIZE_MEDIUM = "1.3rem";
const NAME_FONT_SIZE_LONG = "1.1rem";
const NAME_FONT_SIZE_XLONG = "1rem";
const NAME_LENGTH_THRESHOLD_SHORT = 20;
const NAME_LENGTH_THRESHOLD_MEDIUM = 26;
const NAME_LENGTH_THRESHOLD_LONG = 32;

const resolveFontSize = (nameLength: number): string => {
  if (nameLength <= NAME_LENGTH_THRESHOLD_SHORT) return NAME_FONT_SIZE_SHORT;
  if (nameLength <= NAME_LENGTH_THRESHOLD_MEDIUM) return NAME_FONT_SIZE_MEDIUM;
  if (nameLength <= NAME_LENGTH_THRESHOLD_LONG) return NAME_FONT_SIZE_LONG;
  return NAME_FONT_SIZE_XLONG;
};

export interface StopPlaceHeaderProps {
  stopPlace: StopPlace;
  stopName: string;
  /** Called when the close (X) or back (←) button is clicked. Not rendered when undefined. */
  onClose?: () => void;
  /** Called to toggle the drawer open/closed. */
  onToggle: () => void;
  /** True = drawer is open → show ExpandLess. False = drawer is collapsed → show ExpandMore. */
  isExpanded: boolean;
}

/**
 * Shared stop place header row used in both the full expanded drawer and the
 * collapsed MinimizedBar. Renders:
 *
 *   [X/←?] [stop type icon] [name (scaled) + id caption] [center] [★ fav] [expand/collapse]
 *   [⚠ expired banner — conditional]
 */
export const StopPlaceHeader: React.FC<StopPlaceHeaderProps> = ({
  stopPlace,
  stopName,
  onClose,
  onToggle,
  isExpanded,
}) => {
  const { formatMessage } = useIntl();
  const isStatusEnabled = useElementStatusEnabled();
  const dirtyKeys = useStopPlaceDirtyKeys();
  const isNameDirty =
    isStatusEnabled && hasChangedKey(dirtyKeys, HEADER_NAME_KEYS);
  const nameLength = stopName?.length ?? 0;
  const nameFontSize = resolveFontSize(nameLength);

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
          <ModalityIconImg
            type={stopPlace.stopPlaceType || "other"}
            submode={stopPlace.submode}
            svgStyle={{ width: 24, height: 24 }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* The dot is a sibling, not a child: an inline-flex wrapper inside the
              Typography would defeat the noWrap ellipsis on long names. */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              minWidth: 0,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                fontSize: nameFontSize,
                lineHeight: 1.2,
                minWidth: 0,
              }}
              noWrap={nameLength > NAME_LENGTH_THRESHOLD_MEDIUM}
            >
              {stopName}
            </Typography>
            {isNameDirty && <UnsavedDot />}
          </Box>
          {stopPlace.topographicPlace && (
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ display: "block" }}
            >
              {stopPlace.parentTopographicPlace
                ? `${stopPlace.topographicPlace}, ${stopPlace.parentTopographicPlace}`
                : stopPlace.topographicPlace}
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
            name={stopPlace.name}
            entityType={Entities.STOP_PLACE}
            stopPlaceType={stopPlace.stopPlaceType}
            submode={stopPlace.submode}
            topographicPlace={stopPlace.topographicPlace}
            parentTopographicPlace={stopPlace.parentTopographicPlace}
            location={stopPlace.location}
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

        {onClose && (
          <Tooltip title={formatMessage({ id: "close" })}>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
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
