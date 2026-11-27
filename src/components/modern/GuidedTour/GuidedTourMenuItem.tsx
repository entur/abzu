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

import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { useIntl } from "react-intl";
import { useTourSession } from "./hooks/useTourSession";
import { openTourStartDialog } from "./tourStartDialogStore";
import { setMinimised } from "./tourSessionStore";

interface GuidedTourMenuItemProps {
  onClose: () => void;
}

/** Settings menu entry: start a test tour, or show the running one. */
export const GuidedTourMenuItem = ({ onClose }: GuidedTourMenuItemProps) => {
  const { formatMessage } = useIntl();
  const session = useTourSession();

  const handleClick = () => {
    onClose();
    if (session) setMinimised(false);
    else openTourStartDialog();
  };

  return (
    <MenuItem
      onClick={handleClick}
      sx={{ py: 1, px: 2, borderRadius: 1, mx: 1 }}
    >
      <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
        <FactCheckOutlinedIcon />
      </ListItemIcon>
      <ListItemText
        primary={formatMessage({
          id: session ? "guided_tour_menu_show" : "guided_tour_menu_start",
        })}
      />
    </MenuItem>
  );
};
