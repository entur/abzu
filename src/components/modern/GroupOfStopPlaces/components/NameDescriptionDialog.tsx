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
import { GroupOfStopPlacesDetails } from "./GroupOfStopPlacesDetails";

export interface NameDescriptionDialogProps {
  open: boolean;
  name: string;
  description: string;
  canEdit: boolean;
  onClose: () => void;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

/**
 * Dialog for editing name and description of group of stop places
 * Reuses GroupOfStopPlacesDetails component
 */
export const NameDescriptionDialog: React.FC<NameDescriptionDialogProps> = ({
  open,
  name,
  description,
  canEdit,
  onClose,
  onNameChange,
  onDescriptionChange,
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
        {formatMessage({ id: "name_and_description" })}
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
        {/* Reuse the same component as in the full drawer */}
        <GroupOfStopPlacesDetails
          name={name}
          description={description}
          canEdit={canEdit}
          onNameChange={onNameChange}
          onDescriptionChange={onDescriptionChange}
        />
      </DialogContent>
    </Dialog>
  );
};
