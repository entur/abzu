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

import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Button } from "@mui/material";
import { useUiModeSwitch } from "./hooks/useUiModeSwitch";

/** MUI's desktop Toolbar height, which the legacy header uses unchanged. */
const LEGACY_TOOLBAR_HEIGHT = 64;
/** Large enough to round any button height into a pill. */
const PILL_BORDER_RADIUS = 999;

/**
 * The UI switch as a pill centred in the legacy header, whose title is
 * left-aligned and leaves the middle empty. It overlays the header from
 * outside rather than living in it, so legacy Header.jsx stays untouched.
 *
 * Absolute, not fixed: it scrolls away with the header on long pages.
 * Shown from md up only — narrower, it would run into the title; the
 * header's ⋮ menu still offers the switch there.
 */
export const LegacyHeaderUiModeSwitch = () => {
  const uiModeSwitch = useUiModeSwitch();

  if (!uiModeSwitch) return null;

  const { label, switchUiMode } = uiModeSwitch;

  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      startIcon={<SwapHorizIcon />}
      onClick={switchUiMode}
      sx={{
        display: { xs: "none", md: "inline-flex" },
        position: "absolute",
        top: LEGACY_TOOLBAR_HEIGHT / 2,
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: (theme) => theme.zIndex.appBar + 1,
        borderRadius: PILL_BORDER_RADIUS,
        textTransform: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Button>
  );
};
