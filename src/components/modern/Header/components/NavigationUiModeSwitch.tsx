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

import { SwapHoriz } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useUiModeSwitch } from "../../../UiModeSwitch";
import { useConfirmLeave } from "../../Shared/UnsavedChangesGuard";
import { navigationPillSx } from "./navigationPillSx";

/**
 * The legacy/modern UI switch, at the far end of the navigation line and
 * styled like its tabs. Leaving for the legacy UI unmounts the editors, so
 * it asks about unsaved changes first. Icon-only on phones, where the tabs
 * need the width.
 */
export const NavigationUiModeSwitch = () => {
  const confirmLeave = useConfirmLeave();
  const uiModeSwitch = useUiModeSwitch(confirmLeave);

  if (!uiModeSwitch) return null;

  const { label, switchUiMode } = uiModeSwitch;

  return (
    <Button
      onClick={switchUiMode}
      aria-label={label}
      startIcon={<SwapHoriz fontSize="small" />}
      sx={[
        navigationPillSx,
        {
          flexShrink: 0,
          whiteSpace: "nowrap",
          "& .MuiButton-startIcon": { mr: { xs: 0, sm: 1 }, ml: 0 },
        },
      ]}
    >
      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
        {label}
      </Box>
    </Button>
  );
};
