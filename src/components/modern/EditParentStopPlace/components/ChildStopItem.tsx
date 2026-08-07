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

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import ModalityIconImg from "../../../MainPage/ModalityIconImg";
import { CopyIdButton } from "../../Shared";
import { ChildStopPlaceListItemProps } from "../types";

/**
 * Child stop place row — matches QuayItem row style. Clicking the row
 * navigates to the child stop place (a different entity), unlike quay/parking
 * rows which focus in place.
 */
export const ChildStopItem: React.FC<ChildStopPlaceListItemProps> = ({
  child,
  onNavigate,
  onRemove,
  disabled = false,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Box
      onClick={() => onNavigate(child.id, child.name)}
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        py: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Box sx={{ flexShrink: 0, mr: 1 }}>
        <ModalityIconImg
          type={child.stopPlaceType}
          submode={child.submode}
          svgStyle={{ width: 20, height: 20 }}
        />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
          {child.name}
        </Typography>
        {child.id && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: "monospace" }}
            >
              {child.id}
            </Typography>
            <CopyIdButton idToCopy={child.id} size="small" />
          </Box>
        )}
      </Box>
      {onRemove && (
        <Tooltip title={formatMessage({ id: "remove_stop_from_parent_title" })}>
          <span onClick={(e) => e.stopPropagation()}>
            <IconButton
              size="small"
              color="error"
              disabled={disabled}
              onClick={() => onRemove(child.id)}
              sx={{ ml: 0.5 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )}

      <ChevronRightIcon fontSize="small" color="action" />
    </Box>
  );
};
