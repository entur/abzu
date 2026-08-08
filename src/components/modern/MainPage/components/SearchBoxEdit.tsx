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

import {
  Edit as EditIcon,
  MyLocation as LocationIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FavoriteStopPlacesManager } from "../../../../utils/favoriteStopPlaces";

interface SearchBoxEditProps {
  canEdit: boolean;
  handleEdit: (id: string, entityType: any) => void;
  onClose?: () => void;
  text: {
    edit: string;
    view: string;
  };
  result: {
    id: string;
    name: string;
    entityType: any;
    stopPlaceType?: string;
    submode?: string;
    topographicPlace?: string;
    parentTopographicPlace?: string;
    location?: [number, number];
  };
}

export const SearchBoxEdit: React.FC<SearchBoxEditProps> = ({
  canEdit,
  handleEdit,
  onClose,
  text,
  result,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const favoriteManager = FavoriteStopPlacesManager.getInstance();

  useEffect(() => {
    setIsFavorite(favoriteManager.isFavorite(result.id));
  }, [result.id]);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      favoriteManager.removeFavorite(result.id);
      setIsFavorite(false);
    } else {
      favoriteManager.addFavorite({
        id: result.id,
        name: result.name,
        entityType: result.entityType,
        stopPlaceType: result.stopPlaceType,
        submode: result.submode,
        topographicPlace: result.topographicPlace,
        parentTopographicPlace: result.parentTopographicPlace,
        location: result.location,
      });
      setIsFavorite(true);
    }
  };

  const handleEditClick = () => {
    // Close all panels first
    if (onClose) {
      onClose();
    }
    // Then navigate to edit page
    handleEdit(result.id, result.entityType);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 1,
      }}
    >
      <IconButton
        onClick={handleToggleFavorite}
        size="small"
        sx={{
          color: isFavorite ? "warning.main" : "action.active",
          "&:hover": {
            color: "warning.main",
          },
        }}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? (
          <StarIcon sx={{ width: 20, height: 20 }} />
        ) : (
          <StarBorderIcon sx={{ width: 20, height: 20 }} />
        )}
      </IconButton>

      <Button
        onClick={handleEditClick}
        startIcon={
          canEdit ? (
            <EditIcon sx={{ width: 16, height: 16 }} />
          ) : (
            <LocationIcon sx={{ width: 16, height: 16 }} />
          )
        }
        variant="outlined"
        size="small"
        sx={{
          textTransform: "none",
          fontSize: "0.8rem",
          minWidth: "auto",
        }}
      >
        {canEdit ? text.edit : text.view}
      </Button>
    </Box>
  );
};
