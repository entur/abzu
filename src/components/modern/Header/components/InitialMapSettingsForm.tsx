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

import { MyLocation } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { UserActions } from "../../../../actions";
import SettingsManager from "../../../../singletons/SettingsManager";
import { useAppDispatch } from "../../../../store/hooks";

const Settings = new SettingsManager();

interface InitialMapSettingsFormProps {
  onSave?: () => void;
}

export const InitialMapSettingsForm: React.FC<InitialMapSettingsFormProps> = ({
  onSave,
}) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const currentPosition = useSelector(
    (state: any) => state.stopPlace.centerPosition,
  );
  const currentZoom = useSelector((state: any) => state.stopPlace.zoom);

  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [zoom, setZoom] = useState<string>("");

  useEffect(() => {
    const savedLat = Settings.getInitialLatitude();
    const savedLng = Settings.getInitialLongitude();
    const savedZoom = Settings.getInitialZoom();

    if (savedLat !== null) setLatitude(savedLat.toString());
    if (savedLng !== null) setLongitude(savedLng.toString());
    if (savedZoom !== null) setZoom(savedZoom.toString());
  }, []);

  const handleSetCurrentView = () => {
    if (currentPosition && currentZoom) {
      const lat = currentPosition[0];
      const lng = currentPosition[1];
      setLatitude(lat.toString());
      setLongitude(lng.toString());
      setZoom(currentZoom.toString());
      dispatch(UserActions.setInitialPosition(lat, lng));
      dispatch(UserActions.setInitialZoom(currentZoom));
    }
  };

  const handleSave = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const zoomLevel = parseInt(zoom, 10);

    if (!isNaN(lat) && !isNaN(lng) && !isNaN(zoomLevel)) {
      dispatch(UserActions.setInitialPosition(lat, lng));
      dispatch(UserActions.setInitialZoom(zoomLevel));
      if (onSave) {
        onSave();
      }
    }
  };

  const isValidInput =
    latitude !== "" &&
    longitude !== "" &&
    zoom !== "" &&
    !isNaN(parseFloat(latitude)) &&
    !isNaN(parseFloat(longitude)) &&
    !isNaN(parseInt(zoom, 10));

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Divider sx={{ my: 1 }} />
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          mb: 1.5,
          color: theme.palette.text.secondary,
        }}
      >
        {formatMessage({ id: "initial_map_position" })}
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
        <TextField
          label={formatMessage({ id: "latitude" })}
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          size="small"
          fullWidth
          type="number"
          slotProps={{ htmlInput: { step: "any" } }}
        />
        <TextField
          label={formatMessage({ id: "longitude" })}
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          size="small"
          fullWidth
          type="number"
          slotProps={{ htmlInput: { step: "any" } }}
        />
      </Box>

      <TextField
        label={formatMessage({ id: "zoom_level" })}
        value={zoom}
        onChange={(e) => setZoom(e.target.value)}
        size="small"
        fullWidth
        type="number"
        sx={{ mb: 1.5 }}
        slotProps={{ htmlInput: { min: 1, max: 20 } }}
      />

      <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<MyLocation />}
          onClick={handleSetCurrentView}
          fullWidth
        >
          {formatMessage({ id: "set_current_view_as_default" })}
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleSave}
          disabled={!isValidInput}
          fullWidth
        >
          {formatMessage({ id: "save" })}
        </Button>
      </Box>
    </Box>
  );
};
