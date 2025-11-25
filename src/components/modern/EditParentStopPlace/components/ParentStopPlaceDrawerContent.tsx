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

import { Box, Divider, Drawer, Typography } from "@mui/material";
import { IntlShape } from "react-intl";
import {
  ParentStopPlaceActions,
  ParentStopPlaceChildren,
  ParentStopPlaceDetails,
  ParentStopPlaceHeader,
} from ".";

interface ParentStopPlaceDrawerContentProps {
  stopPlace: any;
  originalStopPlace: any;
  isOpen: boolean;
  isModified: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isMobile: boolean;
  drawerWidth: string | number;
  formatMessage: IntlShape["formatMessage"];
  onGoBack: () => void;
  onCollapse: () => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onOpenAltNames: () => void;
  onOpenTags: () => void;
  onOpenCoordinates: () => void;
  onOpenAddChild: () => void;
  onOpenRemoveChild: (childId: string) => void;
  onRemoveAdjacentSite: (stopPlaceId: string, adjacentRef: string) => void;
  onOpenAddAdjacentSite: () => void;
  onOpenTerminate: () => void;
  onOpenUndo: () => void;
  onOpenSave: () => void;
}

/**
 * Drawer content for parent stop place editor
 * Contains header, details form, children list, and action buttons
 */
export const ParentStopPlaceDrawerContent: React.FC<
  ParentStopPlaceDrawerContentProps
> = ({
  stopPlace,
  originalStopPlace,
  isOpen,
  isModified,
  canEdit,
  canDelete,
  isMobile,
  drawerWidth,
  formatMessage,
  onGoBack,
  onCollapse,
  onNameChange,
  onDescriptionChange,
  onUrlChange,
  onOpenAltNames,
  onOpenTags,
  onOpenCoordinates,
  onOpenAddChild,
  onOpenRemoveChild,
  onRemoveAdjacentSite,
  onOpenAddAdjacentSite,
  onOpenTerminate,
  onOpenUndo,
  onOpenSave,
}) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isOpen}
      transitionDuration={0} // Disable default drawer transition
      sx={{
        width: drawerWidth, // Always maintain width
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          top: { xs: 56, sm: 64 }, // Match header height (56px mobile, 64px desktop)
          height: { xs: "calc(100% - 56px)", sm: "calc(100% - 64px)" },
          // Custom slide animation
          transform: isMobile
            ? isOpen
              ? "translateY(0)"
              : "translateY(100%)"
            : isOpen
              ? "translateY(0)"
              : "translateY(calc(-100% + 65px))", // 65px = minimized bar height
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          bgcolor: "background.paper",
        }}
      >
        {/* Header with close button and collapse button */}
        {originalStopPlace && (
          <ParentStopPlaceHeader
            stopPlace={stopPlace}
            originalStopPlace={originalStopPlace}
            onGoBack={onGoBack}
            onCollapse={onCollapse}
          />
        )}

        <Divider />

        {/* Section Title */}
        <Box sx={{ py: 1.5, px: 2, bgcolor: "background.default" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {formatMessage({ id: "parentStopPlace" })}
          </Typography>
        </Box>

        <Divider />

        {/* Scrollable Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {/* Details Form */}
          <ParentStopPlaceDetails
            name={stopPlace.name}
            description={stopPlace.description}
            url={stopPlace.url}
            location={stopPlace.location}
            hasExpired={stopPlace.hasExpired}
            version={stopPlace.version}
            tags={stopPlace.tags}
            importedId={stopPlace.importedId}
            alternativeNames={stopPlace.alternativeNames}
            belongsToGroup={stopPlace.belongsToGroup}
            groups={stopPlace.groups}
            canEdit={canEdit}
            onNameChange={onNameChange}
            onDescriptionChange={onDescriptionChange}
            onUrlChange={onUrlChange}
            onOpenAltNames={onOpenAltNames}
            onOpenTags={onOpenTags}
            onOpenCoordinates={onOpenCoordinates}
          />

          {/* Children List */}
          <ParentStopPlaceChildren
            children={stopPlace.children}
            adjacentSites={stopPlace.adjacentSites}
            canEdit={canEdit}
            onAddChildren={onOpenAddChild}
            onRemoveChild={onOpenRemoveChild}
            onRemoveAdjacentSite={onRemoveAdjacentSite}
            onAddAdjacentSite={onOpenAddAdjacentSite}
          />
        </Box>

        {/* Action Buttons */}
        <ParentStopPlaceActions
          hasId={!!stopPlace.id}
          isModified={isModified}
          canEdit={canEdit}
          canDelete={canDelete}
          hasName={!!stopPlace.name}
          hasExpired={!!stopPlace.hasExpired}
          hasChildren={stopPlace.children.length > 0}
          onTerminate={onOpenTerminate}
          onUndo={onOpenUndo}
          onSave={onOpenSave}
        />
      </Box>
    </Drawer>
  );
};
