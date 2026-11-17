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

import { extractCoordinates } from "../../../../utils/";
import { checkTypedPosition, Position } from "./coordinateChecks";

const COORDINATE_SEPARATOR = /[\s,]+/;
const COORDINATE_COUNT = 2;

export type CoordinatesTextValidation =
  | { status: "error"; errorId: string }
  | { status: "ok"; position: Position }
  | {
      status: "far";
      position: Position;
      distanceMeters: number;
      swapped: Position | null;
    };

/* "59.9," parses as 59.9, 0, so a half-typed pair must not count. */
const hasTwoValues = (text: string): boolean =>
  text.split(COORDINATE_SEPARATOR).filter(Boolean).length === COORDINATE_COUNT;

/**
 * Parses typed "lat, lng" text and checks it against where the position is
 * expected to be (F-76, F-103). Pure, so the dialog can run it while the
 * user types (F-114) as well as on confirm.
 */
export const validateCoordinatesText = (
  text: string,
  reference?: Position,
): CoordinatesTextValidation => {
  const parsed = hasTwoValues(text) ? extractCoordinates(text) : null;
  if (!parsed)
    return { status: "error", errorId: "change_coordinates_invalid" };

  const position: Position = [Number(parsed[0]), Number(parsed[1])];
  const check = checkTypedPosition(position, reference);
  if (check.status === "invalid") {
    return { status: "error", errorId: "coordinates_out_of_range" };
  }
  if (check.status === "far") return { ...check, position };
  return { status: "ok", position };
};
