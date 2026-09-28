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

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { EntityTabDefinition } from "./EntityTabStrip";

/**
 * A single information tab, for editors whose content is one tab's worth — the
 * parent stop place and the group of stop places.
 *
 * They get the same chrome as a regular stop place this way: a tab strip in both
 * the expanded panel and the collapsed bar, rather than a row of dialog buttons.
 * Callers spread in `dirty`.
 */
export const INFO_ONLY_TABS: readonly EntityTabDefinition[] = [
  {
    index: 0,
    id: "information",
    labelId: "information",
    renderIcon: () => <InfoOutlinedIcon fontSize="small" />,
  },
];

export const INFO_TAB_INDEX = 0;
