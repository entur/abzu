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

import { Box, Button, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import UserActions from "../../../../actions/UserActions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import type { LatLng } from "./types";

interface QuayPathLinkActionsProps {
  quayId: string | undefined;
  location: LatLng;
  onAction: () => void;
}

/**
 * Path link start / terminate / cancel buttons shown inside the quay popup.
 * Renders nothing for new (unsaved) quays since they cannot participate in path links.
 */
export const QuayPathLinkActions = ({
  quayId,
  location,
  onAction,
}: QuayPathLinkActionsProps) => {
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();

  const isCreatingPolylines = useAppSelector(
    (state) => (state.stopPlace as any).isCreatingPolylines as boolean,
  );

  const [lat, lng] = location;

  const handleStart = () => {
    onAction();
    dispatch(UserActions.startCreatingPolyline([lat, lng], quayId, "Quay"));
  };

  const handleTerminate = () => {
    onAction();
    dispatch(
      UserActions.addFinalCoordinesToPolylines([lat, lng], quayId, "Quay"),
    );
  };

  const handleCancel = () => {
    onAction();
    dispatch(UserActions.removeLastPolyline());
  };

  if (!quayId) {
    return (
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {formatMessage({ id: "save_first_path_link" })}
      </Typography>
    );
  }

  if (isCreatingPolylines) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Button
          size="small"
          variant="contained"
          fullWidth
          onClick={handleTerminate}
        >
          {formatMessage({ id: "terminate_path_link_here" })}
        </Button>
        <Button
          size="small"
          variant="outlined"
          fullWidth
          onClick={handleCancel}
        >
          {formatMessage({ id: "cancel_path_link" })}
        </Button>
      </Box>
    );
  }

  return (
    <Button size="small" variant="outlined" fullWidth onClick={handleStart}>
      {formatMessage({ id: "create_path_link_here" })}
    </Button>
  );
};
