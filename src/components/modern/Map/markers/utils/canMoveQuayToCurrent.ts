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

import type { NeighbourStop } from "../types";

interface MoveTarget {
  id?: string;
  isNewStop?: boolean;
  isParent?: boolean;
}

/**
 * Whether a neighbour's quay may be moved into the open stop ("Flytt til
 * gjeldende", F-46). The open stop must be a saved, editable, monomodal stop
 * (legacy rule), and the quay's own stop must be editable too: moving a quay
 * changes both stops, and Tiamat answers 403 for a source the user can't edit
 * (F-108). A source that is no longer among the loaded neighbours counts as
 * not editable.
 */
export const canMoveQuayToCurrent = (
  target: MoveTarget | null,
  canEditTarget: boolean,
  source: Pick<NeighbourStop, "permissions"> | undefined,
): boolean =>
  !!target?.id &&
  !target.isNewStop &&
  !target.isParent &&
  canEditTarget &&
  !!source?.permissions?.canEdit;
