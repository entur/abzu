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
import { GroupOfStopPlacesActions } from "./GroupOfStopPlacesActions";
import { IntlShape } from "react-intl";
import { MinimizedBar } from "../../Shared";
import { GroupOfStopPlacesHeader } from "./GroupOfStopPlacesHeader";
import { appChromeTop } from "../../Header/headerMetrics";

interface GroupOfStopPlacesMinimizedBarProps {
  groupOfStopPlaces: any;
  originalGOS: any;
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
  onOpenDelete: () => void;
  onOpenUndo: () => void;
  onOpenSave: () => void;
}

/**
 * Minimized bar for group of stop places editor
 * Handles configuration and rendering of minimized bar actions
 */
export const GroupOfStopPlacesMinimizedBar: React.FC<
  GroupOfStopPlacesMinimizedBarProps
> = ({
  groupOfStopPlaces,
  originalGOS,
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
  onOpenDelete,
  onOpenUndo,
  onOpenSave,
}) => {
  const theme = useTheme();

  // Define minimized bar actions

  if (isOpen) return null;

  /* One information tab, matching the stop place and parent editors. The dot
     marks unsaved changes, so collapsing never hides them. */
  const tabs = useMemo(
    () => INFO_ONLY_TABS.map((tab) => ({ ...tab, dirty: isModified })),
    [isModified],
  );

  /* The same action bar the expanded panel renders. */
  const actionBar = (
    <GroupOfStopPlacesActions
      hasId={!!groupOfStopPlaces?.id}
      isModified={isModified}
      canEdit={canEdit}
      canDelete={canDelete}
      hasName={!!groupOfStopPlaces?.name}
      onRemove={onOpenDelete}
      onUndo={onOpenUndo}
      onSave={onOpenSave}
    />
  );

  const customHeader = (
    <GroupOfStopPlacesHeader
      groupOfStopPlaces={originalGOS}
      centerPosition={centerLocation}
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
              hasId={!!groupOfStopPlaces.id}
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
            hasId={!!groupOfStopPlaces.id}
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
