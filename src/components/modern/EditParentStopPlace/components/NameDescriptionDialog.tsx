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
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useIntl } from "react-intl";

export interface NameDescriptionDialogProps {
  open: boolean;
  name: string;
  description?: string;
  url?: string;
  canEdit: boolean;
  onClose: () => void;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onUrlChange: (url: string) => void;
}

/**
 * Dialog for editing name, description, and URL of parent stop place
 */
export const NameDescriptionDialog: React.FC<NameDescriptionDialogProps> = ({
  open,
  name,
  description,
  url,
  canEdit,
  onClose,
  onNameChange,
  onDescriptionChange,
  onUrlChange,
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
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          {/* Name Field */}
          <TextField
            label={formatMessage({ id: "name" })}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={!canEdit}
            fullWidth
            required
          />

          {/* Description Field */}
          <TextField
            label={formatMessage({ id: "description" })}
            value={description || ""}
            onChange={(e) => onDescriptionChange(e.target.value)}
            disabled={!canEdit}
            fullWidth
            multiline
            rows={3}
          />

          {/* URL Field */}
          <TextField
            label={formatMessage({ id: "url" })}
            value={url || ""}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={!canEdit}
            fullWidth
            type="url"
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
