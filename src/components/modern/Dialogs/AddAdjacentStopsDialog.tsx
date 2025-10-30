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
import { useSelector } from "react-redux";
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

interface RootState {
  stopPlace: {
    current: {
      children?: ChildStop[];
    };
  };
  user: {
    adjacentStopDialogStopPlace?: string;
  };
}

export interface AddAdjacentStopsDialogProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: (stopPlaceId1: string, stopPlaceId2: string) => void;
}

export const AddAdjacentStopsDialog: React.FC<AddAdjacentStopsDialogProps> = ({
  open,
  handleClose,
  handleConfirm,
}) => {
  const { formatMessage } = useIntl();
  const [selectedStopPlace, setSelectedStopPlace] = useState<string>("NONE");

  const stopPlaceChildren =
    useSelector((state: RootState) => state.stopPlace.current.children) || [];
  const currentStopPlaceId = useSelector(
    (state: RootState) => state.user.adjacentStopDialogStopPlace,
  );

  const isCurrentChildStop = (childStop: ChildStop) => {
    return childStop.id === currentStopPlaceId;
  };

  const isConnected = (childStop: ChildStop) => {
    const currentChild = stopPlaceChildren.find(
      (child) => child.id === currentStopPlaceId,
    );

    // Avoid displaying already existing adjacent site as an option
    if (currentChild && Array.isArray(currentChild.adjacentSites)) {
      return currentChild.adjacentSites.some(
        (adjacentRef) => adjacentRef.ref === childStop.id,
      );
    }
    return false;
  };

  const handleCloseDialog = () => {
    setSelectedStopPlace("NONE");
    handleClose();
  };

  const handleConfirmDialog = () => {
    if (currentStopPlaceId && selectedStopPlace !== "NONE") {
      handleConfirm(currentStopPlaceId, selectedStopPlace);
    }
    setSelectedStopPlace("NONE");
  };

  const filteredChildren = stopPlaceChildren.filter(
    (child) => !isCurrentChildStop(child),
  );

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {formatMessage({ id: "connect_to_adjacent_stop_title" })}
        </Typography>
        <IconButton onClick={handleCloseDialog} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
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
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {child.isParent ? (
                          <Typography sx={{ fontWeight: 600, minWidth: 30 }}>
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

          <Box
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}
          >
            <Button variant="outlined" onClick={handleCloseDialog}>
              {formatMessage({ id: "cancel" })}
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmDialog}
              disabled={selectedStopPlace === "NONE"}
            >
              {formatMessage({ id: "confirm" })}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
