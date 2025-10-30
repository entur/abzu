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
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { getChildStopPlaceSuggestions } from "../../../modelUtils/leafletUtils";
import HasExpiredInfo from "../../MainPage/HasExpiredInfo";
import ModalityIconImg from "../../MainPage/ModalityIconImg";

interface StopPlaceSuggestion {
  id: string;
  name: string;
  stopPlaceType: string;
  submode?: string;
  hasExpired?: boolean;
  isParent?: boolean;
}

interface RootState {
  stopPlace: {
    current: {
      children?: any[];
      location?: [number, number];
    };
    neighbourStops?: any[];
  };
}

export interface AddStopPlaceToParentDialogProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: (stopPlaceIds: string[]) => void;
}

export const AddStopPlaceToParentDialog: React.FC<
  AddStopPlaceToParentDialogProps
> = ({ open, handleClose, handleConfirm }) => {
  const { formatMessage } = useIntl();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const stopPlaceChildren =
    useSelector((state: RootState) => state.stopPlace.current.children) || [];
  const stopPlaceCentroid = useSelector(
    (state: RootState) => state.stopPlace.current.location,
  );
  const neighbourStops =
    useSelector((state: RootState) => state.stopPlace.neighbourStops) || [];

  const handleItemCheck = (id: string, checked: boolean) => {
    if (checked) {
      setCheckedItems([...checkedItems, id]);
    } else {
      setCheckedItems(checkedItems.filter((item) => item !== id));
    }
  };

  const handleCloseDialog = () => {
    setCheckedItems([]);
    handleClose();
  };

  const handleConfirmDialog = () => {
    handleConfirm(checkedItems);
    setCheckedItems([]);
  };

  const suggestions = getChildStopPlaceSuggestions(
    stopPlaceChildren,
    stopPlaceCentroid,
    neighbourStops,
    10,
  ) as StopPlaceSuggestion[];

  const canSave = checkedItems.length > 0;

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {formatMessage({ id: "add_stop_place" })}
        </Typography>
        <IconButton onClick={handleCloseDialog} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Box sx={{ mb: 2, maxHeight: 400, overflowY: "auto" }}>
            {suggestions.map((suggestion) => {
              const isChecked = checkedItems.includes(suggestion.id);
              const isDisabled = suggestion.hasExpired;

              return (
                <Box
                  key={suggestion.id}
                  sx={{
                    py: 0.5,
                    opacity: isDisabled ? 0.6 : 1,
                    transition: "opacity 0.3s",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={isDisabled}
                        checked={isChecked}
                        onChange={(e) =>
                          handleItemCheck(suggestion.id, e.target.checked)
                        }
                      />
                    }
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {suggestion.isParent ? (
                          <Typography sx={{ fontWeight: 600, minWidth: 30 }}>
                            MM
                          </Typography>
                        ) : (
                          <Box sx={{ minWidth: 30 }}>
                            <ModalityIconImg
                              type={suggestion.stopPlaceType}
                              submode={suggestion.submode}
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
                            fontStyle: !suggestion.name ? "italic" : "normal",
                          }}
                        >
                          {suggestion.name ||
                            formatMessage({ id: "is_missing_name" })}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {suggestion.id}
                        </Typography>
                        <HasExpiredInfo
                          show={suggestion.hasExpired}
                          formatMessage={formatMessage}
                        />
                      </Box>
                    }
                  />
                </Box>
              );
            })}
            {suggestions.length === 0 && (
              <Typography variant="body2" sx={{ textAlign: "center", py: 2 }}>
                {formatMessage({ id: "no_stops_nearby" })}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={handleCloseDialog}>
              {formatMessage({ id: "change_coordinates_cancel" })}
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmDialog}
              disabled={!canSave}
            >
              {formatMessage({ id: "add" })}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
