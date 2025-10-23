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
  Switch,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { getGroupMemberSuggestions } from "../../../modelUtils/leafletUtils";
import AddStopPlaceSuggestionList from "../../Dialogs/AddStopPlaceSuggestionList";
import { AddMemberToGroupProps, RootState } from "../GroupOfStopPlaces";

/**
 * Modern dialog for adding stop places to a group
 * Shows nearby stop place suggestions with checkbox selection
 */
export const AddMemberToGroup: React.FC<AddMemberToGroupProps> = ({
  open,
  onConfirm,
  onClose,
}) => {
  const { formatMessage } = useIntl();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [showInactive, setShowInactive] = useState(false);

  const groupMembers = useSelector(
    (state: RootState) => state.stopPlacesGroup.current.members || [],
  );
  const stopPlaceCentroid = useSelector(
    (state: RootState) => state.stopPlacesGroup.centerPosition,
  );
  const neighbourStops = useSelector(
    (state: RootState) => state.stopPlace.neighbourStops || [],
  );

  const handleItemCheck = (id: string, value: boolean) => {
    if (value) {
      setCheckedItems([...checkedItems, id]);
    } else {
      setCheckedItems(checkedItems.filter((item) => item !== id));
    }
  };

  const handleConfirm = () => {
    onConfirm(checkedItems);
    setCheckedItems([]);
    setShowInactive(false);
  };

  const handleClose = () => {
    onClose();
    setCheckedItems([]);
    setShowInactive(false);
  };

  const allSuggestions = getGroupMemberSuggestions(
    groupMembers,
    stopPlaceCentroid,
    neighbourStops,
    30,
  );

  const suggestions = showInactive
    ? allSuggestions
    : allSuggestions.filter((suggestion: any) => !suggestion.hasExpired);

  const canSave = checkedItems.length > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        <Typography variant="h6" sx={{ flex: 1 }}>
          {formatMessage({ id: "add_stop_place" })}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
              />
            }
            label={formatMessage({ id: "show_inactive_stops" })}
            sx={{ alignSelf: "flex-start" }}
          />
          <Box
            sx={{
              maxHeight: 400,
              overflowY: "auto",
              pr: 1,
            }}
          >
            <AddStopPlaceSuggestionList
              suggestions={suggestions}
              checkedItems={checkedItems}
              formatMessage={formatMessage}
              onItemCheck={handleItemCheck}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-end",
              pt: 1,
            }}
          >
            <Button variant="outlined" onClick={handleClose} color="secondary">
              {formatMessage({ id: "change_coordinates_cancel" })}
            </Button>
            <Button
              variant="contained"
              disabled={!canSave}
              onClick={handleConfirm}
            >
              {formatMessage({ id: "add" })}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
