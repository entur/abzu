/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import DeleteIcon from "@mui/icons-material/Delete";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import ModalityIconImg from "../../../MainPage/ModalityIconImg";
import ModalityIconTray from "../../../ReportPage/ModalityIconTray";
import {
  CopyIdButton,
  LoadingDialog,
  useNavigateToStopPlace,
} from "../../Shared";
import { StopPlaceListItemProps } from "../types";

/**
 * Stop place list item — matches QuayItem row style.
 * Clicking the row fetches and navigates to the stop place (with loading feedback).
 */
export const StopPlaceListItem: React.FC<StopPlaceListItemProps> = ({
  stopPlace,
  onRemove,
  disabled = false,
}) => {
  const { formatMessage } = useIntl();
  const { loading, loadingName, navigateTo } = useNavigateToStopPlace();

  return (
    <>
      <LoadingDialog
        open={loading}
        message={
          loadingName
            ? `${formatMessage({ id: "loading" })} ${loadingName}`
            : formatMessage({ id: "loading" })
        }
      />

      <Box
        onClick={() => navigateTo(stopPlace.id, stopPlace.name)}
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
        {/* Modality icon */}
        <Box
          sx={{ flexShrink: 0, mr: 1, display: "flex", alignItems: "center" }}
        >
          {stopPlace.isParent && stopPlace.children ? (
            <ModalityIconTray
              modalities={stopPlace.children.map((child) => ({
                stopPlaceType: child.stopPlaceType,
                submode: child.submode,
              }))}
            />
          ) : (
            <ModalityIconImg
              type={stopPlace.stopPlaceType}
              submode={stopPlace.submode}
              svgStyle={{ width: 20, height: 20 }}
            />
          )}
          {stopPlace.adjacentSites && stopPlace.adjacentSites.length > 0 && (
            <InsertLinkIcon
              sx={{ fontSize: "0.9rem", color: "text.secondary", ml: -0.5 }}
            />
          )}
        </Box>

        {/* Name + ID */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {stopPlace.name}
          </Typography>
          {stopPlace.id && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontFamily: "monospace" }}
              >
                {stopPlace.id}
              </Typography>
              <CopyIdButton idToCopy={stopPlace.id} size="small" />
            </Box>
          )}
        </Box>

        {/* Remove button */}
        {onRemove && (
          <Tooltip
            title={formatMessage({ id: "remove_stop_from_parent_title" })}
          >
            <span onClick={(e) => e.stopPropagation()}>
              <IconButton
                size="small"
                color="error"
                disabled={disabled}
                onClick={() => onRemove(stopPlace.id)}
                sx={{ ml: 0.5 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Box>
    </>
  );
};
