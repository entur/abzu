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

import { useState } from "react";
import { useMapNotice } from "../notices/useMapNotice";

/** `[lat, lng]`, the order Redux stores positions in. */
type Position = [number, number];

const OUTSIDE_AREA_MESSAGE_ID = "create_not_allowed";
const CHECK_FAILED_MESSAGE_ID = "position_check_failed";

interface CheckedMove {
  /** Where the marker should be drawn while the move is being checked. */
  pendingPosition: Position | null;
  /** Resolves to true when the move was stored. */
  moveTo: (position: Position) => Promise<boolean>;
}

/**
 * Moves a map element through a permission-checked action (F-106, F-107).
 * The marker stays where it was dropped while the check runs; a refused move
 * clears `pendingPosition`, so the marker snaps back to its stored position,
 * and the user is told why.
 */
export const useCheckedMove = (
  moveIfAllowed: (position: Position) => Promise<boolean>,
): CheckedMove => {
  const showNotice = useMapNotice();
  const [pendingPosition, setPendingPosition] = useState<Position | null>(null);

  const moveTo = async (position: Position): Promise<boolean> => {
    setPendingPosition(position);
    try {
      const isAllowed = await moveIfAllowed(position);
      if (!isAllowed) showNotice(OUTSIDE_AREA_MESSAGE_ID);
      return isAllowed;
    } catch {
      showNotice(CHECK_FAILED_MESSAGE_ID);
      return false;
    } finally {
      setPendingPosition(null);
    }
  };

  return { pendingPosition, moveTo };
};
