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

import type { DrawerWidth } from "../../../Shared/drawerWidth";

/** Space between the + and the drawer edge or the map's left edge, in pixels. */
export const FAB_GAP = 8;

interface FabPositionInput {
  isEditorOpen: boolean;
  isDrawerOpen: boolean;
  drawerWidth: DrawerWidth;
}

/**
 * Where the map's + sits from the left (F-10d). Beside the editor drawer on
 * desktop and tablet, open or collapsed: a collapsed drawer still shows its
 * header bar, at full drawer width, in the top-left corner. On a phone the
 * drawer is full width: the + is hidden while it covers the map (nothing
 * could be placed) and at the map's edge once it is collapsed, because it
 * then slides away. At the map's edge when no editor is open.
 */
export const fabLeftFor = ({
  isEditorOpen,
  isDrawerOpen,
  drawerWidth,
}: FabPositionInput): number | null => {
  if (!isEditorOpen) return FAB_GAP;
  if (typeof drawerWidth === "number") return drawerWidth + FAB_GAP;
  return isDrawerOpen ? null : FAB_GAP;
};
