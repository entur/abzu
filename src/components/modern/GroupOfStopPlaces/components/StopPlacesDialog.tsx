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
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useIntl } from "react-intl";
import { GroupOfStopPlacesListProps } from "../types";
import { GroupOfStopPlacesList } from "./GroupOfStopPlacesList";

export interface StopPlacesDialogProps extends GroupOfStopPlacesListProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Dialog for managing stop places in a group
 */
export const StopPlacesDialog: React.FC<StopPlacesDialogProps> = ({
  open,
  onClose,
  stopPlaces,
  canEdit,
  onAddMembers,
  onRemoveMember,
}) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 1,
        }}
      >
        {formatMessage({ id: "stop_places" })}
        <IconButton
          edge="end"
          onClick={onClose}
          aria-label={formatMessage({ id: "close" })}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <GroupOfStopPlacesList
          stopPlaces={stopPlaces}
          canEdit={canEdit}
          onAddMembers={onAddMembers}
          onRemoveMember={onRemoveMember}
        />
      </DialogContent>
    </Dialog>
  );
};
