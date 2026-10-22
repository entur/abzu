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

import { useAppSelector } from "../../../../store/hooks";
import {
  buildElementStatusByIndex,
  isPendingStatus,
} from "../../Shared/ElementStatus";
import { useCanEditOnMap } from "../hooks/useCanEditOnMap";
import { useMapCurrentStop } from "../hooks/useMapCurrentStop";
import { QuayMarkerItem } from "./QuayMarkerItem";
import type { FocusedElement } from "./types";

export const QuayMarkers = () => {
  const current = useMapCurrentStop();
  const canEditOnMap = useCanEditOnMap(current);
  const focusedElement = useAppSelector(
    (state) =>
      (state as any).mapUtils?.focusedElement as FocusedElement | undefined,
  );
  const isCompassBearingEnabled = useAppSelector(
    (state) => (state.stopPlace as any).isCompassBearingEnabled as boolean,
  );
  const showPublicCode = useAppSelector(
    (state) => (state.user as any).showPublicCode as boolean,
  );
  const isMergingStop = useAppSelector(
    (state) => !!(state as any).stopPlace?.mergeStopDialog?.isOpen,
  );
  const originalQuays = useAppSelector(
    (state) => (state.stopPlace as any).originalCurrent?.quays,
  );

  if (!current?.quays?.length) return null;
  if (isMergingStop) return null;

  const quayStatuses = buildElementStatusByIndex(current.quays, originalQuays);

  return (
    <>
      {current.quays.map((quay, index) => (
        <QuayMarkerItem
          key={quay.id || index}
          quay={quay}
          index={index}
          disabled={!canEditOnMap}
          focused={
            focusedElement?.type === "quay" && focusedElement?.index === index
          }
          showCompassBearing={isCompassBearingEnabled}
          showPublicCode={showPublicCode}
          isPending={isPendingStatus(quayStatuses[index] ?? "unchanged")}
          stopLocation={current.location}
        />
      ))}
    </>
  );
};
