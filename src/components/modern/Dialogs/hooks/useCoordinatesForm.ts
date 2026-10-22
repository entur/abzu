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
import { extractCoordinates } from "../../../../utils/";
import {
  checkTypedPosition,
  Position,
} from "../../Shared/coordinates/coordinateChecks";

/** What a typed position is compared with, and how the warning names it. */
export interface CoordinatesReference {
  position: Position;
  kind: "stop" | "quay" | "previous";
}

export interface FarWarning {
  distanceMeters: number;
  swapped: Position | null;
}

interface CoordinatesForm {
  /** The field's text (the initial coordinates until the user types). */
  text: string;
  errorId: string | null;
  farWarning: FarWarning | null;
  setText: (text: string) => void;
  /** Confirms, or asks first when the position is far from the reference. */
  confirm: () => void;
  applySwapped: () => void;
  reset: () => void;
}

const formatPosition = ([lat, lng]: Position): string => `${lat}, ${lng}`;

/**
 * State for typing coordinates (F-76, F-103). An impossible position is an
 * error; one far from its reference (a quay 300 km from its stop, or lat and
 * lng swapped) needs a second confirm, and a likely swap is offered.
 */
export const useCoordinatesForm = (
  initialText: string | undefined,
  onConfirm: (position: Position) => void,
  reference?: CoordinatesReference,
): CoordinatesForm => {
  const [typedText, setTypedText] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [farWarning, setFarWarning] = useState<FarWarning | null>(null);
  const text = typedText ?? initialText ?? "";

  const setText = (newText: string) => {
    setTypedText(newText);
    setErrorId(null);
    setFarWarning(null);
  };

  const reset = () => {
    setTypedText(null);
    setErrorId(null);
    setFarWarning(null);
  };

  const confirm = () => {
    const parsed = extractCoordinates(text);
    if (!parsed) {
      setErrorId("change_coordinates_invalid");
      return;
    }
    const position: Position = [Number(parsed[0]), Number(parsed[1])];
    const check = checkTypedPosition(position, reference?.position);
    if (check.status === "invalid") {
      setErrorId("coordinates_out_of_range");
      return;
    }
    // Asked once already for this text: the user chose to continue.
    if (check.status === "far" && !farWarning) {
      setFarWarning({
        distanceMeters: check.distanceMeters,
        swapped: check.swapped,
      });
      return;
    }
    onConfirm(position);
    reset();
  };

  const applySwapped = () => {
    if (farWarning?.swapped) setText(formatPosition(farWarning.swapped));
  };

  return { text, errorId, farWarning, setText, confirm, applySwapped, reset };
};
