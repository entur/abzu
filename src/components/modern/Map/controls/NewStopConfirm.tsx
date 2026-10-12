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

import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Marker } from "react-map-gl/maplibre";
import { useNavigate } from "react-router-dom";
import { StopPlaceActions } from "../../../../actions";
import AppRoutes from "../../../../routes";
import { useAppDispatch } from "../../../../store/hooks";
import type { MapPosition } from "./hooks/usePlacement";

const PIN_SIZE = 36;

interface NewStopConfirmProps {
  position: MapPosition;
  /** Closes the prompt but stays in placement mode, to click elsewhere. */
  onCancel: () => void;
  /** Ends placement once the new stop has been opened. */
  onCreated: () => void;
}

/**
 * Temporary pin for a new stop with a "create here?" prompt (F-13). Nothing
 * is created until the user confirms; clicking the map again moves the pin.
 */
export const NewStopConfirm = ({
  position,
  onCancel,
  onCreated,
}: NewStopConfirmProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [pinElement, setPinElement] = useState<HTMLElement | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      // Await so the new stop (with its location permissions) is in Redux
      // before the editor route mounts.
      await dispatch(
        StopPlaceActions.createNewStop({
          lat: position.latitude,
          lng: position.longitude,
        }),
      );
      onCreated();
      navigate(`/${AppRoutes.STOP_PLACE}/new`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Marker
        latitude={position.latitude}
        longitude={position.longitude}
        anchor="bottom"
      >
        <Box ref={setPinElement} sx={{ color: "warning.main", lineHeight: 0 }}>
          <AddLocationAltIcon sx={{ fontSize: PIN_SIZE }} />
        </Box>
      </Marker>
      {/* Non-modal, so a click on the map still reaches it and moves the pin. */}
      <Popper
        open={!!pinElement}
        anchorEl={pinElement}
        placement="top"
        modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
        sx={{ zIndex: (theme) => theme.zIndex.modal }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 1.5,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {formatMessage({ id: "new_stop_question" })}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button size="small" onClick={onCancel} disabled={isCreating}>
              {formatMessage({ id: "cancel" })}
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleCreate}
              disabled={isCreating}
              startIcon={isCreating ? <CircularProgress size={14} /> : null}
            >
              {formatMessage({ id: "create_now" })}
            </Button>
          </Box>
        </Paper>
      </Popper>
    </>
  );
};
