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
  ClickAwayListener,
  Grow,
  IconButton,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import { useId } from "react";
import { useIntl } from "react-intl";
import { useMarkerPopupDismiss } from "../hooks/useMarkerPopupDismiss";
import { usePopupFollowsMap } from "../hooks/usePopupFollowsMap";
import { MarkerPopupDetails } from "./MarkerPopupDetails";

/** Matches QuayMarkers' marker-scale transition and QuayItem's row transition, so focus-change feels like one motion. */
const FOCUS_TRANSITION_MS = 200;
/** Gap between the marker and the popup, in pixels. */
const POPUP_OFFSET = 8;

interface MarkerPopupProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  title: string;
  id?: string;
  lat: number;
  lng: number;
  minWidth?: number;
  /** When set, the coordinates can be clicked to type exact ones (F-76). */
  onEditCoordinates?: () => void;
  children?: React.ReactNode;
}

/**
 * The popup for every map marker. Non-modal (F-80): the map stays usable
 * while it is open, so another marker can be clicked straight away, hover
 * tooltips work and the map can be panned; the popup follows its marker.
 * It closes with ×, Esc, a click on the map or a click elsewhere.
 */
export const MarkerPopup = ({
  anchorEl,
  onClose,
  title,
  id,
  lat,
  lng,
  minWidth = 200,
  onEditCoordinates,
  children,
}: MarkerPopupProps) => {
  const { formatMessage } = useIntl();
  const titleId = useId();
  const open = !!anchorEl;
  const handleClickAway = useMarkerPopupDismiss(open, onClose);
  const popperRef = usePopupFollowsMap(open);

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="top"
      role="presentation"
      popperRef={popperRef}
      transition
      modifiers={[{ name: "offset", options: { offset: [0, POPUP_OFFSET] } }]}
      sx={{ zIndex: (theme) => theme.zIndex.modal }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} timeout={FOCUS_TRANSITION_MS}>
          <Paper
            role="dialog"
            aria-labelledby={titleId}
            elevation={8}
            sx={{ borderRadius: 2, minWidth }}
          >
            <ClickAwayListener onClickAway={handleClickAway}>
              <Box sx={{ p: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <Typography
                    id={titleId}
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      color: "primary.main",
                      flex: 1,
                    }}
                  >
                    {title}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={onClose}
                    aria-label={formatMessage({ id: "close" })}
                    sx={{ p: 0.25, mt: -0.25, mr: -0.5 }}
                  >
                    <CloseIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </Box>

                <MarkerPopupDetails
                  id={id}
                  lat={lat}
                  lng={lng}
                  onEditCoordinates={onEditCoordinates}
                />

                {children}
              </Box>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};
