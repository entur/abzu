/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import { useSyncExternalStore } from "react";
import {
  getDrawerPreference,
  setDrawerPreference,
  subscribeToDrawerOpen,
} from "../drawerPreference";

interface DrawerOpenState {
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

/**
 * Whether the editors' side drawer is open or collapsed: one sticky state,
 * shared live with everything that follows the drawer (F-10d).
 */
export const useDrawerOpen = (): DrawerOpenState => {
  const isDrawerOpen = useSyncExternalStore(
    subscribeToDrawerOpen,
    getDrawerPreference,
  );
  return { isDrawerOpen, setDrawerOpen: setDrawerPreference };
};
