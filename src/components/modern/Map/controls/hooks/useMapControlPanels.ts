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

import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleShowFareZonesInMap } from "../../../../../reducers/zonesSlice";

export type MapPanel = "layers" | "settings" | "zones";

export interface MapControlPanels {
  activePanel: MapPanel | null;
  /** Opens a panel, or closes it if it is the open one. */
  togglePanel: (panel: MapPanel) => void;
  closePanel: () => void;
}

/**
 * Which map control panel is open. The fare-zones panel also turns the
 * zones on the map on and off with it.
 */
export const useMapControlPanels = (): MapControlPanels => {
  const dispatch = useDispatch() as any;
  const [activePanel, setActivePanel] = useState<MapPanel | null>(null);

  const togglePanel = useCallback(
    (panel: MapPanel) => {
      const opening = activePanel !== panel;
      setActivePanel(opening ? panel : null);
      if (panel === "zones") dispatch(toggleShowFareZonesInMap(opening));
      else if (activePanel === "zones")
        dispatch(toggleShowFareZonesInMap(false));
    },
    [activePanel, dispatch],
  );

  const closePanel = useCallback(() => {
    if (activePanel === "zones") dispatch(toggleShowFareZonesInMap(false));
    setActivePanel(null);
  }, [activePanel, dispatch]);

  return { activePanel, togglePanel, closePanel };
};
