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

import { useEffect, useState } from "react";
import { Position } from "../../Shared/coordinates/coordinateChecks";
import { validateCoordinatesText } from "../../Shared/coordinates/validateCoordinatesText";

/** How long typing must pause before the checks show (F-114). */
const LIVE_CHECK_DELAY_MS = 300;

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
 *
 * The checks show once typing pauses, not only on confirm (F-114). A far
 * position the user has already been shown confirms on the next press.
 */
export const useCoordinatesForm = (
  initialText: string | undefined,
  onConfirm: (position: Position) => void,
  reference?: CoordinatesReference,
): CoordinatesForm => {
  const [typedText, setTypedText] = useState<string | null>(null);
  /** The text whose check result is on screen. */
  const [revealedText, setRevealedText] = useState<string | null>(null);
  const text = typedText ?? initialText ?? "";
  const validation = validateCoordinatesText(text, reference?.position);
  const isRevealed = revealedText === text;

  useEffect(() => {
    if (!typedText?.trim()) return;
    const timer = setTimeout(
      () => setRevealedText(typedText),
      LIVE_CHECK_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [typedText]);

  const reset = () => {
    setTypedText(null);
    setRevealedText(null);
  };

  const confirm = () => {
    if (
      validation.status === "ok" ||
      (validation.status === "far" && isRevealed)
    ) {
      onConfirm(validation.position);
      reset();
      return;
    }
    setRevealedText(text);
  };

  const applySwapped = () => {
    if (validation.status === "far" && validation.swapped) {
      setTypedText(formatPosition(validation.swapped));
    }
  };

  const errorId =
    isRevealed && validation.status === "error" ? validation.errorId : null;
  const farWarning =
    isRevealed && validation.status === "far"
      ? {
          distanceMeters: validation.distanceMeters,
          swapped: validation.swapped,
        }
      : null;

  return {
    text,
    errorId,
    farWarning,
    setText: setTypedText,
    confirm,
    applySwapped,
    reset,
  };
};
