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

import { Box, Slide, useTheme } from "@mui/material";
import { useMemo } from "react";
import { EntityTabStrip, INFO_ONLY_TABS, INFO_TAB_INDEX } from "../../Shared";
import { ParentStopPlaceActions } from "./ParentStopPlaceActions";
import { IntlShape } from "react-intl";
import { MinimizedBar } from "../../Shared";
import { ParentStopPlaceHeader } from "./ParentStopPlaceHeader";
import { appChromeTop } from "../../Header/headerMetrics";

interface ParentStopPlaceMinimizedBarProps {
  stopPlace: any;
  originalStopPlace: any;
  centerLocation?: [number, number];
  isOpen: boolean;
  isModified: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isMobile: boolean;
  drawerWidth: string | number;
  formatMessage: IntlShape["formatMessage"];
  onExpand: () => void;
  onClose: () => void;
  onOpenTerminate: () => void;
  onOpenUndo: () => void;
  onOpenSave: () => void;
}

/**
 * Minimized bar for parent stop place editor
 * Handles configuration and rendering of minimized bar actions
 */
export const ParentStopPlaceMinimizedBar: React.FC<
  ParentStopPlaceMinimizedBarProps
> = ({
  stopPlace,
  originalStopPlace,
  centerLocation,
  isOpen,
  isModified,
  canEdit,
  canDelete,
  isMobile,
  drawerWidth,
  formatMessage,
  onExpand,
  onClose,
  onOpenTerminate,
  onOpenUndo,
  onOpenSave,
}) => {
  const theme = useTheme();

  // Define minimized bar actions

  if (isOpen || !originalStopPlace) return null;

  /* One information tab, mirroring the regular stop place's strip. The dot marks
     unsaved changes, so collapsing never hides them. */
  const tabs = useMemo(
    () => INFO_ONLY_TABS.map((tab) => ({ ...tab, dirty: isModified })),
    [isModified],
  );

  /* The same action bar the expanded panel renders, so save, undo and terminate
     stay reachable while collapsed. */
  const actionBar = (
    <ParentStopPlaceActions
      hasId={!!stopPlace?.id}
      isModified={isModified}
      canEdit={canEdit}
      canDelete={canDelete}
      hasName={!!stopPlace?.name}
      hasExpired={!!stopPlace?.hasExpired}
      hasChildren={(stopPlace?.children?.length ?? 0) > 0}
      onTerminate={onOpenTerminate}
      onUndo={onOpenUndo}
      onSave={onOpenSave}
    />
  );

  const customHeader = (
    <ParentStopPlaceHeader
      stopPlace={stopPlace}
      originalStopPlace={originalStopPlace}
      onGoBack={onClose}
      onToggle={onExpand}
      isExpanded={false}
    />
  );

  return (
    <>
      {isMobile ? (
        <Slide direction="up" in={!isOpen} mountOnEnter unmountOnExit>
          <Box>
            <MinimizedBar
              icon={<span />}
              hasId={!!stopPlace?.id}
              tabStrip={
                <EntityTabStrip
                  tabs={tabs}
                  activeTab={INFO_TAB_INDEX}
                  showLabels
                  onTabChange={onExpand}
                />
              }
              actionBar={actionBar}
              onExpand={onExpand}
              onClose={onClose}
              centerLocation={centerLocation}
              isMobile={true}
              customHeader={customHeader}
            />
          </Box>
        </Slide>
      ) : (
        <Box
          sx={{
            position: "fixed",
            left: 0,
            top: appChromeTop,
            width: drawerWidth,
            zIndex: theme.zIndex.drawer,
          }}
        >
          <MinimizedBar
            icon={<span />}
            hasId={!!stopPlace?.id}
            tabStrip={
              <EntityTabStrip
                tabs={tabs}
                activeTab={INFO_TAB_INDEX}
                showLabels
                onTabChange={onExpand}
              />
            }
            actionBar={actionBar}
            onExpand={onExpand}
            onClose={onClose}
            centerLocation={centerLocation}
            isMobile={false}
            customHeader={customHeader}
          />
        </Box>
      )}
    </>
  );
};
