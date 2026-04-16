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

import { Paper, Typography } from "@mui/material";
import { useIntl } from "react-intl";

export const NewStopHint = () => {
  const { formatMessage } = useIntl();

  return (
    <Paper
      elevation={4}
      sx={{
        position: "absolute",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        px: 3,
        py: 1.5,
        zIndex: 10,
        pointerEvents: "none",
        bgcolor: "warning.main",
        color: "warning.contrastText",
        borderRadius: 2,
      }}
    >
      <Typography variant="body2" fontWeight={600}>
        {formatMessage({ id: "map_creating_stop_hint" })}
      </Typography>
    </Paper>
  );
};
