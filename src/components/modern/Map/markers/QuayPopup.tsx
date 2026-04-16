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
import MergeTypeIcon from "@mui/icons-material/MergeType";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { UserActions } from "../../../../actions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { MarkerPopup } from "./MarkerPopup";
import { QuayPathLinkActions } from "./QuayPathLinkActions";
import type { MapQuay, MapStopPlace } from "./types";

interface QuayPopupProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  quay: MapQuay;
  index: number;
  disabled: boolean;
  lat: number;
  lng: number;
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
}: QuayPopupProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

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
      {quay.compassBearing != null && (
        <>
          <Divider sx={{ my: 0.75 }} />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {formatMessage({ id: "compass_bearing" })}: {quay.compassBearing}°
          </Typography>
        </>
      )}

      {!disabled && (
        <>
          <Divider sx={{ my: 0.75 }} />
          {quay.location && (
            <QuayPathLinkActions
              quayId={quay.id}
              location={quay.location}
              onAction={onClose}
            />
          )}
        </>
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
