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
import { ParentStopPlaceChildrenProps } from "../types";
import { ParentStopPlaceChildren } from "./ParentStopPlaceChildren";

export interface ChildrenDialogProps
  extends Omit<ParentStopPlaceChildrenProps, "isLoading"> {
  open: boolean;
  onClose: () => void;
}

/**
 * Dialog for managing children in a parent stop place
 */
export const ChildrenDialog: React.FC<ChildrenDialogProps> = ({
  open,
  onClose,
  children,
  adjacentSites,
  canEdit,
  onAddChildren,
  onRemoveChild,
  onRemoveAdjacentSite,
  onAddAdjacentSite,
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
        {formatMessage({ id: "children" })}
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
        <ParentStopPlaceChildren
          children={children}
          adjacentSites={adjacentSites}
          canEdit={canEdit}
          onAddChildren={onAddChildren}
          onRemoveChild={onRemoveChild}
          onRemoveAdjacentSite={onRemoveAdjacentSite}
          onAddAdjacentSite={onAddAdjacentSite}
        />
      </DialogContent>
    </Dialog>
  );
};
