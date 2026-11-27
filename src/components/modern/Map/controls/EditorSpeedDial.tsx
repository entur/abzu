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

import { Close as CloseIcon } from "@mui/icons-material";
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import type { ElementType } from "./hooks/usePlacement";
import { addElementFabSx, FAB_TOP } from "./utils/addElementFabSx";
import { actionsFor } from "./utils/stopElementActions";

interface EditorSpeedDialProps {
  left: number;
  isPlacing: boolean;
  isQuayFocused: boolean;
  onStartElement: (elementType: ElementType) => void;
  onCancelPlacement: () => void;
}

/**
 * With a stop open, the + is a menu of what can be added to it (F-10):
 * opened and closed by click only, labels always visible. While placing,
 * its × cancels.
 */
export const EditorSpeedDial = ({
  left,
  isPlacing,
  isQuayFocused,
  onStartElement,
  onCancelPlacement,
}: EditorSpeedDialProps) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);

  /** Passed via slotProps.fab to style each action's internal Fab. */
  const actionFabSx = {
    bgcolor: theme.palette.grey.A100,
    color: theme.palette.text.primary,
    transition: "background-color 0.2s, color 0.2s",
    "&:hover": {
      bgcolor: theme.palette.grey[800],
      color: theme.palette.common.white,
    },
  };

  const handleStartElement = (elementType: ElementType) => {
    setOpen(false);
    onStartElement(elementType);
  };

  return (
    <SpeedDial
      ariaLabel={formatMessage({ id: "map_add_element" })}
      icon={isPlacing ? <CloseIcon /> : <SpeedDialIcon />}
      open={open}
      // Click only: hover and focus used to open it, so the click that
      // followed closed it again (F-10).
      onOpen={(_, reason) => {
        if (reason === "toggle" && !isPlacing) setOpen(true);
      }}
      onClose={(_, reason) => {
        if (reason !== "mouseLeave") setOpen(false);
      }}
      direction="down"
      // While placing, the × cancels; MUI's own toggle then sees isPlacing
      // and stays closed.
      FabProps={{ onClick: isPlacing ? onCancelPlacement : undefined }}
      sx={{
        position: "absolute",
        top: FAB_TOP,
        left,
        transition: "left 0.3s ease-in-out",
        "& .MuiSpeedDial-fab": addElementFabSx(isPlacing),
      }}
    >
      {actionsFor(isQuayFocused).map((action) => (
        <SpeedDialAction
          key={action.elementType}
          icon={action.icon}
          slotProps={{
            // Labels always visible, also on touch devices (F-10a).
            tooltip: {
              title: formatMessage({ id: action.labelKey }),
              open: true,
              placement: "right",
            },
            fab: { sx: actionFabSx },
            staticTooltipLabel: { sx: { whiteSpace: "nowrap" } },
          }}
          onClick={() => handleStartElement(action.elementType)}
        />
      ))}
    </SpeedDial>
  );
};
