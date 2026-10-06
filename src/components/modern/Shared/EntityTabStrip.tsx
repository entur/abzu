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

import { Tab, Tabs, Tooltip } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { DirtyBadge } from "./ElementStatus";

const TAB_MIN_HEIGHT = 40;

export interface EntityTabDefinition {
  /** Tab index — also what a collapsed shortcut targets. */
  index: number;
  id: string;
  labelId: string;
  renderIcon: () => React.ReactElement;
  /** Whether this tab currently holds unsaved changes. */
  dirty?: boolean;
}

interface EntityTabStripProps {
  tabs: readonly EntityTabDefinition[];
  activeTab: number;
  onTabChange: (tabIndex: number) => void;
  /**
   * Show each tab's label beside its icon.
   *
   * The stop place's five tabs are icon-only because five labels will not fit.
   * A strip with one or two tabs has the room, and without a label a lone
   * full-width tab reads as a stray underline rather than a tab. The label also
   * makes the tooltip redundant, so it is suppressed.
   */
  showLabels?: boolean;
}

/**
 * The tab strip used by every editor — stop place, parent stop place and group.
 *
 * Rendered in both the expanded panel and the collapsed bar so the two are the
 * same layout, and shared across the three editors so they read as one product
 * rather than three panels that happen to sit in the same place.
 *
 * A single-tab strip is a legitimate use: it gives the parent and group editors
 * the same chrome as a stop place even though they have one tab's worth of
 * content.
 */
export const EntityTabStrip = ({
  tabs,
  activeTab,
  onTabChange,
  showLabels = false,
}: EntityTabStripProps) => {
  const { formatMessage } = useIntl();

  const renderTab = (tab: EntityTabDefinition) => {
    const label = formatMessage({ id: tab.labelId });

    return (
      <Tab
        key={tab.id}
        icon={
          <DirtyBadge dirty={Boolean(tab.dirty)}>{tab.renderIcon()}</DirtyBadge>
        }
        iconPosition={showLabels ? "start" : undefined}
        label={showLabels ? label : undefined}
        value={tab.index}
        /* Tabs' onChange fires only when the value changes, so clicking the
           already-selected tab would do nothing — including when the panel is
           collapsed and that click is meant to reopen it. */
        onClick={() => {
          if (tab.index === activeTab) {
            onTabChange(tab.index);
          }
        }}
      />
    );
  };

  return (
    <Tabs
      value={activeTab}
      onChange={(_, value) => onTabChange(value)}
      variant="fullWidth"
      sx={{
        minHeight: TAB_MIN_HEIGHT,
        "& .MuiTab-root": { minHeight: TAB_MIN_HEIGHT, py: 0 },
      }}
    >
      {tabs.map((tab) =>
        showLabels ? (
          renderTab(tab)
        ) : (
          <Tooltip
            key={tab.id}
            title={formatMessage({ id: tab.labelId })}
            placement="bottom"
          >
            {renderTab(tab)}
          </Tooltip>
        ),
      )}
    </Tabs>
  );
};
