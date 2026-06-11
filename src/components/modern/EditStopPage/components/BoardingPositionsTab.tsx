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

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import { useAppDispatch } from "../../../../store/hooks";
import { CopyIdButton } from "../../Shared";
import { Quay, StopPlace } from "../types";

interface BoardingPositionsTabProps {
  quay: Quay;
  quayIndex: number;
  stopPlace: StopPlace;
  canEdit: boolean;
}

/**
 * Boarding positions list for a single quay.
 * Extracted from QuayPanel to keep that component within the file size limit.
 */
export const BoardingPositionsTab: React.FC<BoardingPositionsTabProps> = ({
  quay,
  quayIndex,
  stopPlace,
  canEdit,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  return (
    <Box>
      {/* Sub-header with add button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1,
          bgcolor: "background.default",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ flex: 1, fontWeight: 600 }}
        >
          {formatMessage({ id: "boarding_positions_tab_label" })}
        </Typography>
        <Chip label={quay.boardingPositions?.length ?? 0} size="small" />
        <Tooltip title={formatMessage({ id: "new_boarding_position" })}>
          <span>
            <IconButton
              size="small"
              color="primary"
              disabled={!canEdit}
              onClick={() => {
                dispatch(StopPlaceActions.setElementFocus(quayIndex, "quay"));
                dispatch(
                  StopPlaceActions.addElementToStop(
                    "boardingPosition",
                    quay.location || stopPlace.location || [0, 0],
                  ),
                );
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <Divider />

      {/* Boarding position list */}
      {!quay.boardingPositions || quay.boardingPositions.length === 0 ? (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {formatMessage({ id: "no_boarding_positions" })}
          </Typography>
        </Box>
      ) : (
        quay.boardingPositions.map((bp, bpIndex) => (
          <Box
            key={bp.id || `bp-${bpIndex}`}
            sx={{
              px: 2,
              py: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <TextField
                label={formatMessage({ id: "publicCode" })}
                value={bp.publicCode || ""}
                onChange={(e) =>
                  dispatch(
                    StopPlaceActions.changeBoardingPositionPublicCode(
                      bpIndex,
                      quayIndex,
                      e.target.value.substring(0, 3),
                    ),
                  )
                }
                disabled={!canEdit}
                size="small"
                sx={{ flex: 1 }}
                inputProps={{ maxLength: 3 }}
              />
              {canEdit && (
                <Tooltip title={formatMessage({ id: "delete" })}>
                  <IconButton
                    size="small"
                    color="error"
                    sx={{ mt: 0.5 }}
                    onClick={() =>
                      dispatch(
                        StopPlaceActions.removeBoardingPositionElement(
                          bpIndex,
                          quayIndex,
                        ),
                      )
                    }
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            {bp.id && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.25,
                  mt: 0.5,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {bp.id}
                </Typography>
                <CopyIdButton idToCopy={bp.id} size="small" />
              </Box>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};
