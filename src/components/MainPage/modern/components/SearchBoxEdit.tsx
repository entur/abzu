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
} from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";

interface SearchBoxEditProps {
  canEdit: boolean;
  handleEdit: (id: string, entityType: any) => void;
  text: {
    edit: string;
    view: string;
  };
  result: {
    id: string;
    entityType: any;
  };
}

export const SearchBoxEdit: React.FC<SearchBoxEditProps> = ({
  canEdit,
  handleEdit,
  text,
  result,
}) => {
  return (
    <Box sx={{ width: "100%", textAlign: "right", mt: 1 }}>
      <Button
        onClick={() => handleEdit(result.id, result.entityType)}
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
