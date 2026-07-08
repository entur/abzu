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

import { Close as CloseIcon } from "@mui/icons-material";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { UserActions } from "../../../../actions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";

export const MergeModeHint = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const mergeSource = useAppSelector(
    (state) =>
      (state as any).stopPlace?.mergeStopDialog as
        | { isOpen: boolean; id?: string; name?: string }
        | undefined,
  );
  const currentName = useAppSelector(
    (state) => (state as any).stopPlace?.current?.name as string | undefined,
  );

  if (!mergeSource?.isOpen) return null;

  const sourceName = mergeSource.name ?? mergeSource.id ?? "";

  return (
    <Paper
      elevation={4}
      sx={{
        position: "absolute",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        px: 2,
        py: 1,
        zIndex: 10,
        pointerEvents: "auto",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
        whiteSpace: "nowrap",
      }}
    >
      <CallMergeIcon fontSize="small" />
      <Box>
        <Typography variant="caption" fontWeight={700} display="block">
          {formatMessage({ id: "merge_stop_title" })}
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {sourceName}
          {currentName ? ` → ${currentName}` : ""}
        </Typography>
      </Box>
      <IconButton
        size="small"
        onClick={() => dispatch(UserActions.hideMergeStopDialog())}
        sx={{ color: "primary.contrastText", ml: 0.5 }}
        aria-label={formatMessage({ id: "cancel" })}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};
