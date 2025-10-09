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

import { Check } from "@mui/icons-material";
import {
  Box,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  useTheme,
} from "@mui/material";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserActions } from "../../actions";
import { ConfigContext } from "../../config/ConfigContext";
import { defaultOSMTile } from "./mapDefaults";

export const MapLayersPanel: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch() as any;
  const { mapConfig } = useContext(ConfigContext);

  const activeBaselayer = useSelector(
    (state: any) => state.user.activeBaselayer,
  );

  const defaultTiles = [defaultOSMTile];
  const tiles = mapConfig?.tiles || defaultTiles;

  const handleLayerChange = (layerName: string) => {
    dispatch(UserActions.changeActiveBaselayer(layerName));
  };

  const settingItemStyle = {
    py: 1,
    px: 1.5,
    borderRadius: 1,
    mb: 0.5,
    fontSize: "0.875rem",
    minHeight: 40,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  };

  return (
    <MenuList sx={{ p: 0 }}>
      {tiles.map((tile: any) => (
        <MenuItem
          key={tile.name}
          onClick={() => handleLayerChange(tile.name)}
          sx={settingItemStyle}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            {activeBaselayer === tile.name ? (
              <Check fontSize="small" color="primary" />
            ) : (
              <Box sx={{ width: 20, height: 20 }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={tile.name}
            slotProps={{
              primary: {
                sx: {
                  fontSize: "0.875rem",
                },
              },
            }}
          />
        </MenuItem>
      ))}
    </MenuList>
  );
};
