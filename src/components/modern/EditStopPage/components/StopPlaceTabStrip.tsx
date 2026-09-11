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

import { useMemo } from "react";
import { EntityTabStrip } from "../../Shared";
import { useStopPlaceTabDirty } from "../hooks/useStopPlaceTabDirty";
import { STOP_PLACE_TABS } from "../stopPlaceTabs";

interface StopPlaceTabStripProps {
  activeTab: number;
  onTabChange: (tabIndex: number) => void;
}

/**
 * Binds the stop place's tab definitions and dirty state to the shared strip.
 * Rendered by both the expanded panel and the collapsed bar.
 */
export const StopPlaceTabStrip = ({
  activeTab,
  onTabChange,
}: StopPlaceTabStripProps) => {
  const isTabDirty = useStopPlaceTabDirty();

  const tabs = useMemo(
    () =>
      STOP_PLACE_TABS.map((tab) => ({
        ...tab,
        dirty: isTabDirty(tab.dirtyKeys),
      })),
    [isTabDirty],
  );

  return (
    <EntityTabStrip
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
};
