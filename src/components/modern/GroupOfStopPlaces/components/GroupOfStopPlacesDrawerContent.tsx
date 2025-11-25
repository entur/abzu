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

import { Box, Divider, Drawer } from "@mui/material";
import {
  GroupOfStopPlacesActions,
  GroupOfStopPlacesDetails,
  GroupOfStopPlacesHeader,
  GroupOfStopPlacesList,
} from ".";

interface GroupOfStopPlacesDrawerContentProps {
  groupOfStopPlaces: any;
  originalGOS: any;
  isOpen: boolean;
  isModified: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isMobile: boolean;
  drawerWidth: string | number;
  onGoBack: () => void;
  onCollapse: () => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAddMembers: (memberIds: string[]) => void;
  onRemoveMember: (memberId: string) => void;
  onOpenDelete: () => void;
  onOpenUndo: () => void;
  onOpenSave: () => void;
}

/**
 * Drawer content for group of stop places editor
 * Contains header, details form, stop places list, and action buttons
 */
export const GroupOfStopPlacesDrawerContent: React.FC<
  GroupOfStopPlacesDrawerContentProps
> = ({
  groupOfStopPlaces,
  originalGOS,
  isOpen,
  isModified,
  canEdit,
  canDelete,
  isMobile,
  drawerWidth,
  onGoBack,
  onCollapse,
  onNameChange,
  onDescriptionChange,
  onAddMembers,
  onRemoveMember,
  onOpenDelete,
  onOpenUndo,
  onOpenSave,
}) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isOpen}
      transitionDuration={0}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          top: { xs: 56, sm: 64 },
          height: { xs: "calc(100% - 56px)", sm: "calc(100% - 64px)" },
          transform: isMobile
            ? isOpen
              ? "translateY(0)"
              : "translateY(100%)"
            : isOpen
              ? "translateY(0)"
              : "translateY(calc(-100% + 65px))",
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
        {/* Header with close and collapse buttons */}
        <GroupOfStopPlacesHeader
          groupOfStopPlaces={originalGOS}
          onGoBack={onGoBack}
          onCollapse={onCollapse}
        />

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
          <GroupOfStopPlacesDetails
            name={groupOfStopPlaces.name}
            description={groupOfStopPlaces.description}
            canEdit={canEdit}
            onNameChange={onNameChange}
            onDescriptionChange={onDescriptionChange}
          />

          {/* Stop Places List */}
          <GroupOfStopPlacesList
            stopPlaces={groupOfStopPlaces.members}
            canEdit={canEdit}
            onAddMembers={onAddMembers}
            onRemoveMember={onRemoveMember}
          />
        </Box>

        {/* Action Buttons */}
        <GroupOfStopPlacesActions
          hasId={!!groupOfStopPlaces.id}
          isModified={isModified}
          canEdit={canEdit}
          canDelete={canDelete}
          hasName={!!groupOfStopPlaces.name}
          onRemove={onOpenDelete}
          onUndo={onOpenUndo}
          onSave={onOpenSave}
        />
      </Box>
    </Drawer>
  );
};
