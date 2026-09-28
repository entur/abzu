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

import { Map, Report } from "@mui/icons-material";
import { alpha, Box, Tab, Tabs } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import AppRoutes from "../../../../routes";
import { useAppSelector } from "../../../../store/hooks";
import { NAVIGATION_LINE_HEIGHT } from "../headerMetrics";

const MAIN_TAB = "main";
const REPORTS_TAB = "reports";

const INACTIVE_TAB_OPACITY = 0.7;
const SEPARATOR_OPACITY = 0.15;
const SELECTED_TAB_OPACITY = 0.16;
const HOVERED_TAB_OPACITY = 0.08;

/* Insets the pill from the top and bottom of the line, so the highlight can
   never touch the edge the editor panel is docked against. */
const TAB_INSET = 4;

interface NavigationLineProps {
  onNavigateToMain: () => void;
  onNavigateToReports: () => void;
}

/**
 * The application's primary navigation, as a tab strip under the header.
 *
 * Only real in-app destinations belong here. The user guide was briefly a tab,
 * but it is a link out to the Confluence wiki — a tab that silently leaves the
 * application is an action whose consequence is invisible until you take it.
 * It lives under the help control instead, with the deployment's other
 * reference links. An in-app help page would earn a tab here; a link out does
 * not.
 */
export const NavigationLine: React.FC<NavigationLineProps> = ({
  onNavigateToMain,
  onNavigateToReports,
}) => {
  const { formatMessage } = useIntl();
  const pathname = useAppSelector(
    (state: any) => state.router.location.pathname,
  );

  // Editor routes sit on top of the map, so they keep the map tab lit rather
  // than leaving the strip with nothing selected.
  const activeTab =
    pathname === `/${AppRoutes.REPORTS}` ? REPORTS_TAB : MAIN_TAB;

  const handleTabChange = (
    _event: React.SyntheticEvent,
    nextTab: string,
  ): void => {
    if (nextTab === REPORTS_TAB) {
      onNavigateToReports();
      return;
    }
    onNavigateToMain();
  };

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 2 },
        borderTop: 1,
        borderColor: (theme) =>
          alpha(theme.palette.primary.contrastText, SEPARATOR_OPACITY),
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons={false}
        aria-label={formatMessage({ id: "navigation" })}
        sx={{
          minHeight: NAVIGATION_LINE_HEIGHT,
          /* No underline. MUI pins the indicator to the bottom of the strip,
             which is the bottom of the AppBar — exactly where the editor drawer
             is docked, so it read as the panel's own border. The entity tab
             strip inside the panel already owns the underline affordance; app
             navigation uses a pill so the two can't be confused either. */
          "& .MuiTabs-indicator": {
            display: "none",
          },
          "& .MuiTab-root": {
            minHeight: NAVIGATION_LINE_HEIGHT - TAB_INSET * 2,
            my: `${TAB_INSET}px`,
            minWidth: 0,
            px: 2,
            borderRadius: 1,
            textTransform: "none",
            color: (theme) =>
              alpha(theme.palette.primary.contrastText, INACTIVE_TAB_OPACITY),
            "&:hover": {
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.contrastText, HOVERED_TAB_OPACITY),
            },
            "&.Mui-selected": {
              color: "primary.contrastText",
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.contrastText, SELECTED_TAB_OPACITY),
            },
          },
        }}
      >
        <Tab
          value={MAIN_TAB}
          icon={<Map fontSize="small" />}
          iconPosition="start"
          label={formatMessage({ id: "navigation_map" })}
        />
        <Tab
          value={REPORTS_TAB}
          icon={<Report fontSize="small" />}
          iconPosition="start"
          label={formatMessage({ id: "report_site" })}
        />
      </Tabs>
    </Box>
  );
};
