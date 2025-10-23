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

import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import {
  Box,
  Collapse,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useIntl } from "react-intl";
import ModalityIconImg from "../../../MainPage/ModalityIconImg";
import ModalityIconTray from "../../../ReportPage/ModalityIconTray";
import StopPlaceLink from "../../../ReportPage/StopPlaceLink";
import { StopPlaceListItemProps } from "../types";

/**
 * Modern stop place list item component
 * Shows stop place with expand/collapse functionality
 */
export const StopPlaceListItem: React.FC<StopPlaceListItemProps> = ({
  stopPlace,
  expanded,
  onExpand,
  onCollapse,
  onRemove,
  disabled = false,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  return (
    <Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1,
          px: 1.5,
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            gap: 1,
          }}
        >
          {/* Modality Icon */}
          {stopPlace.isParent && stopPlace.children ? (
            <ModalityIconTray
              modalities={stopPlace.children.map((child) => ({
                stopPlaceType: child.stopPlaceType,
                submode: child.submode,
              }))}
              style={{ marginTop: -8 }}
            />
          ) : (
            <ModalityIconImg
              type={stopPlace.stopPlaceType}
              submode={stopPlace.submode}
              svgStyle={{ transform: "scale(0.8)" }}
              style={{ marginTop: -8 }}
            />
          )}

          {/* Adjacent Sites Indicator */}
          {stopPlace.adjacentSites && stopPlace.adjacentSites.length > 0 && (
            <InsertLinkIcon
              sx={{
                fontSize: "1em",
                color: "text.secondary",
                ml: -1.5,
                mt: -1.5,
              }}
            />
          )}

          {/* Stop Place Name */}
          <Typography variant="body2" sx={{ fontSize: "0.9em" }}>
            {stopPlace.name}
          </Typography>

          {/* Stop Place Link */}
          <Box sx={{ ml: "auto" }}>
            <StopPlaceLink style={{ fontSize: "0.8em" }} id={stopPlace.id} />
          </Box>
        </Box>

        {/* Expand/Collapse Button */}
        <IconButton
          size="small"
          onClick={expanded ? onCollapse : onExpand}
          sx={{ ml: 1 }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Expanded Details */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: "background.default",
          }}
        >
          {/* Remove Button */}
          {onRemove && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontSize: "0.85em" }}>
                {formatMessage({ id: "remove_stop_from_parent_title" })}
              </Typography>
              <IconButton
                size="small"
                disabled={disabled}
                onClick={() => onRemove(stopPlace.id)}
                sx={{
                  color: theme.palette.error.main,
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </Collapse>
      <Divider />
    </Box>
  );
};
