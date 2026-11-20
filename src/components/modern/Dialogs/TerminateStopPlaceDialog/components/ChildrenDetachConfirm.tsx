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
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";

export interface ChildToDetach {
  id: string;
  name?: string;
}

interface ChildrenDetachConfirmProps {
  childrenToDetach: ChildToDetach[];
  isConfirmed: boolean;
  onConfirmedChange: (isConfirmed: boolean) => void;
}

/**
 * Deactivating a multimodal stop first detaches its children, which stay
 * active as ordinary stops. Lists them and asks the user to confirm that.
 */
export const ChildrenDetachConfirm: React.FC<ChildrenDetachConfirmProps> = ({
  childrenToDetach,
  isConfirmed,
  onConfirmedChange,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="info" sx={{ mb: 1 }}>
        {formatMessage({ id: "terminate_parent_detach_children_info" })}
      </Alert>
      <Typography variant="subtitle2">
        {formatMessage({ id: "terminate_parent_children_heading" })}
      </Typography>
      <List dense disablePadding>
        {childrenToDetach.map(({ id, name }) => (
          <ListItem key={id} disableGutters>
            <ListItemText primary={name || id} secondary={name ? id : null} />
          </ListItem>
        ))}
      </List>
      <FormControlLabel
        control={
          <Checkbox
            checked={isConfirmed}
            onChange={(event) => onConfirmedChange(event.target.checked)}
          />
        }
        label={formatMessage({
          id: "terminate_parent_detach_children_confirm",
        })}
      />
    </Box>
  );
};
