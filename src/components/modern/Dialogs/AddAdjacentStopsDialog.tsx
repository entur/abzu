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
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions, UserActions } from "../../../actions";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import HasExpiredInfo from "../../MainPage/HasExpiredInfo";
import ModalityIconImg from "../../MainPage/ModalityIconImg";

interface ChildStop {
  id: string;
  name: string;
  stopPlaceType: string;
  submode?: string;
  hasExpired?: boolean;
  isParent?: boolean;
  adjacentSites?: Array<{ ref: string }>;
}

/**
 * Self-contained dialog for connecting two sibling child stops as adjacent.
 * Reads open state and stop data from Redux; dispatches close/confirm actions directly.
 */
export const AddAdjacentStopsDialog: React.FC = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const [selectedStopPlace, setSelectedStopPlace] = useState<string>("NONE");

  const open = useAppSelector(
    (state) => (state.user as any).adjacentStopDialogOpen as boolean,
  );
  const currentStopPlaceId = useAppSelector(
    (state) =>
      (state.user as any).adjacentStopDialogStopPlace as string | undefined,
  );
  const current = useAppSelector((state) => state.stopPlace.current as any);
  // When editing the parent: children are on current directly.
  // When editing a child stop: siblings are on current.parentStop.children.
  const stopPlaceChildren: ChildStop[] = current?.isParent
    ? (current?.children ?? [])
    : (current?.parentStop?.children ?? []);

  const isCurrentChildStop = (child: ChildStop) =>
    child.id === currentStopPlaceId;

  const isConnected = (child: ChildStop) => {
    const currentChild = stopPlaceChildren.find(
      (c) => c.id === currentStopPlaceId,
    );
    if (currentChild && Array.isArray(currentChild.adjacentSites)) {
      return currentChild.adjacentSites.some((ref) => ref.ref === child.id);
    }
    return false;
  };

  const handleClose = () => {
    setSelectedStopPlace("NONE");
    dispatch(UserActions.hideAddAdjacentStopDialog());
  };

  const handleConfirm = () => {
    if (currentStopPlaceId && selectedStopPlace !== "NONE") {
      dispatch(
        StopPlaceActions.addAdjacentConnection(
          currentStopPlaceId,
          selectedStopPlace,
        ),
      );
    }
    setSelectedStopPlace("NONE");
    dispatch(UserActions.hideAddAdjacentStopDialog());
  };

  const filteredChildren = stopPlaceChildren.filter(
    (child) => !isCurrentChildStop(child),
  );

  return (
    <Dialog open={!!open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 1 }}>
        <Typography variant="h6" component="span" sx={{ flex: 1 }}>
          {formatMessage({ id: "connect_to_adjacent_stop_title" })}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {filteredChildren.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontStyle: "italic" }}
            >
              {formatMessage({ id: "connect_to_adjacent_stop_no_options" })}
            </Typography>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {formatMessage({ id: "connect_to_adjacent_stop_description" })}
              </Typography>
              <RadioGroup
                value={selectedStopPlace}
                onChange={(e) => setSelectedStopPlace(e.target.value)}
              >
                {filteredChildren.map((child) => {
                  const disabled = isConnected(child);
                  const checked = selectedStopPlace === child.id || disabled;

                  return (
                    <Box
                      key={child.id}
                      sx={{
                        py: 0.5,
                        opacity: disabled ? 0.6 : 1,
                        transition: "opacity 0.3s",
                      }}
                    >
                      <FormControlLabel
                        value={child.id}
                        control={<Radio />}
                        disabled={disabled}
                        checked={checked}
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {child.isParent ? (
                              <Typography
                                sx={{ fontWeight: 600, minWidth: 30 }}
                              >
                                MM
                              </Typography>
                            ) : (
                              <Box sx={{ minWidth: 30 }}>
                                <ModalityIconImg
                                  type={child.stopPlaceType}
                                  submode={child.submode}
                                />
                              </Box>
                            )}
                            <Typography
                              variant="body2"
                              sx={{
                                flex: 1,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontStyle: !child.name ? "italic" : "normal",
                              }}
                            >
                              {child.name ||
                                formatMessage({ id: "is_missing_name" })}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                            >
                              {child.id}
                            </Typography>
                            <HasExpiredInfo
                              show={child.hasExpired}
                              formatMessage={formatMessage}
                            />
                          </Box>
                        }
                      />
                    </Box>
                  );
                })}
              </RadioGroup>
            </>
          )}

          <Box
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}
          >
            <Button variant="outlined" onClick={handleClose}>
              {formatMessage({ id: "cancel" })}
            </Button>
            {filteredChildren.length > 0 && (
              <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={selectedStopPlace === "NONE"}
              >
                {formatMessage({ id: "confirm" })}
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
