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

import CallMergeIcon from "@mui/icons-material/CallMerge";
import CancelIcon from "@mui/icons-material/Cancel";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import ExploreIcon from "@mui/icons-material/Explore";
import ExploreOffIcon from "@mui/icons-material/ExploreOff";
import MapIcon from "@mui/icons-material/Map";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import StreetviewIcon from "@mui/icons-material/Streetview";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import { StopPlaceActions, UserActions } from "../../../../actions";
import { useConfig } from "../../../../config/ConfigContext";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { MarkerPopup } from "./MarkerPopup";
import type { MapQuay, MapStopPlace } from "./types";

const buildOsmEditUrl = (lat: number, lng: number) =>
  `https://www.openstreetmap.org/edit#map=18/${lat}/${lng}`;

const buildStreetViewUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;

const buildSvvUrl = (lat: number, lng: number) =>
  `https://vegbilder.atlas.vegvesen.no/?lat=${lat}&lng=${lng}&zoom=16&view=image`;

interface QuayPopupProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  quay: MapQuay;
  index: number;
  disabled: boolean;
  lat: number;
  lng: number;
  isEditingBearing: boolean;
  onStartEditBearing: () => void;
  onEndEditBearing: () => void;
}

/**
 * Popup for quay markers.
 * Shows quay info and contextual actions: merge quay workflow and move to new stop place.
 */
export const QuayPopup = ({
  anchorEl,
  onClose,
  quay,
  index,
  disabled,
  lat,
  lng,
  isEditingBearing,
  onStartEditBearing,
  onEndEditBearing,
}: QuayPopupProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const { featureFlags } = useConfig();
  const showSvvLink = !!featureFlags?.SVVStreetViewLink;

  const current = useAppSelector(
    (state) => state.stopPlace.current as MapStopPlace | null,
  );
  const mergingQuay = useAppSelector(
    (state) =>
      (state as any).mapUtils?.mergingQuay as {
        isMerging: boolean;
        fromQuay: { id: string } | null;
      },
  );

  const hasSavedId = !!quay.id;
  const stopIsNew = !current?.id;
  const isMultimodal = !!current?.isParent;
  const isMerging = !!mergingQuay?.isMerging;
  const isFromQuay = isMerging && mergingQuay?.fromQuay?.id === quay.id;

  const showMergeStart = !disabled && hasSavedId && !isMerging && !stopIsNew;
  const showMergeCancel = isMerging && isFromQuay;
  const showMergeComplete = isMerging && !isFromQuay;
  const showMoveToNewStop =
    !disabled && hasSavedId && !stopIsNew && !isMultimodal;

  const label = quay.publicCode || String(index + 1);
  const title = `${formatMessage({ id: "quay" })} ${label}`;

  const handleMergeStart = () => {
    onClose();
    dispatch(UserActions.startMergingQuayFrom(quay.id));
  };

  const handleMergeCancel = () => {
    onClose();
    dispatch(UserActions.cancelMergingQuayFrom());
  };

  const handleMergeComplete = () => {
    onClose();
    dispatch(UserActions.endMergingQuayTo(quay.id));
  };

  const handleMoveToNewStop = () => {
    onClose();
    dispatch(
      UserActions.moveQuayToNewStopPlace({
        id: quay.id,
        privateCode: quay.privateCode,
        publicCode: quay.publicCode,
        stopPlaceId: current?.id,
      }),
    );
  };

  return (
    <MarkerPopup
      anchorEl={anchorEl}
      onClose={onClose}
      title={title}
      id={quay.id}
      lat={lat}
      lng={lng}
    >
      <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
        <Tooltip title={formatMessage({ id: "quay_link_osm" })}>
          <IconButton
            size="small"
            component="a"
            href={buildOsmEditUrl(lat, lng)}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "text.secondary" }}
          >
            <MapIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={formatMessage({ id: "quay_link_street_view" })}>
          <IconButton
            size="small"
            component="a"
            href={buildStreetViewUrl(lat, lng)}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "text.secondary" }}
          >
            <StreetviewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {showSvvLink && (
          <Tooltip title={formatMessage({ id: "quay_link_svv" })}>
            <IconButton
              size="small"
              component="a"
              href={buildSvvUrl(lat, lng)}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "text.secondary" }}
            >
              <MapIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Divider sx={{ my: 0.75 }} />
      {isEditingBearing ? (
        <Button
          size="small"
          variant="contained"
          color="success"
          startIcon={<ExploreIcon />}
          onClick={onEndEditBearing}
          fullWidth
        >
          {formatMessage({ id: "change_compass_bearing_confirm" })}
        </Button>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {quay.compassBearing != null && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ExploreIcon sx={{ fontSize: "0.9rem", color: "success.main" }} />
              <Typography
                variant="caption"
                sx={{ flex: 1, color: "text.secondary" }}
              >
                {formatMessage({ id: "compass_bearing" })}:{" "}
                {quay.compassBearing}°
              </Typography>
              {!disabled && (
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<ExploreOffIcon />}
                  onClick={() =>
                    dispatch(
                      StopPlaceActions.changeQuayCompassBearing(index, null),
                    )
                  }
                  sx={{ minWidth: 0, px: 0.5, fontSize: "0.65rem" }}
                >
                  {formatMessage({ id: "remove" })}
                </Button>
              )}
            </Box>
          )}
          {!disabled && (
            <Button
              size="small"
              variant="outlined"
              color="success"
              startIcon={<ExploreIcon />}
              onClick={onStartEditBearing}
              fullWidth
            >
              {formatMessage({ id: "change_compass_bearing" })}
            </Button>
          )}
        </Box>
      )}

      {(showMergeStart ||
        showMergeCancel ||
        showMergeComplete ||
        showMoveToNewStop) && (
        <>
          <Divider sx={{ my: 0.75 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {showMergeStart && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<MergeTypeIcon />}
                onClick={handleMergeStart}
                fullWidth
              >
                {formatMessage({ id: "merge_quay_from" })}
              </Button>
            )}
            {showMergeCancel && (
              <Button
                size="small"
                variant="outlined"
                color="warning"
                startIcon={<CancelIcon />}
                onClick={handleMergeCancel}
                fullWidth
              >
                {formatMessage({ id: "merge_quay_cancel" })}
              </Button>
            )}
            {showMergeComplete && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<CallMergeIcon />}
                onClick={handleMergeComplete}
                fullWidth
              >
                {formatMessage({ id: "merge_quay_to" })}
              </Button>
            )}
            {showMoveToNewStop && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<DriveFileMoveIcon />}
                onClick={handleMoveToNewStop}
                fullWidth
              >
                {formatMessage({ id: "move_quay" })}
              </Button>
            )}
          </Box>
        </>
      )}
    </MarkerPopup>
  );
};
