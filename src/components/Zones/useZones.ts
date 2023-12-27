import { AsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { useCallback, useEffect, useMemo } from "react";
import { TariffZone } from "../../models/TariffZone";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";

export interface Options<T extends TariffZone> {
  showSelector: (state: RootState) => boolean;
  zonesForFilterSelector: (state: RootState) => T[];
  zonesSelector: (state: RootState) => T[];
  getZonesForFilterAction: AsyncThunk<T[], void, { state: RootState }>;
  getZonesAction: AsyncThunk<T[], string[], { state: RootState }>;
  selectedZonesSelector: (state: RootState) => string[];
  setSelectedZonesAction: (ids: string[]) => PayloadAction<string[]>;
}

export const useZones = <T extends TariffZone>({
  showSelector,
  zonesForFilterSelector,
  zonesSelector,
  getZonesForFilterAction,
  getZonesAction,
  selectedZonesSelector,
  setSelectedZonesAction,
}: Options<T>) => {
  const dispatch = useAppDispatch();

  const show = useAppSelector<boolean>(showSelector);
  const zonesForFilter = useAppSelector<T[]>(zonesForFilterSelector);
  const zones = useAppSelector<T[]>(zonesSelector);
  const selectedZones = useAppSelector<string[]>(selectedZonesSelector);
  const setSelectedZones = useCallback(
    (ids: string[]) => {
      dispatch(setSelectedZonesAction(ids));
    },
    [dispatch, setSelectedZonesAction],
  );
  useEffect(() => {
    const zoneIds = selectedZones.filter(
      (id) => !zones.some((zone) => zone.id === id),
    );

    if (zoneIds.length > 0) {
      dispatch(
        getZonesAction(
          selectedZones.filter((id) => !zones.some((zone) => zone.id === id)),
        ),
      );
    }
  }, [selectedZones]);

  useEffect(() => {
    if (show) {
      dispatch(getZonesForFilterAction());
    }
  }, [show]);

  const zonesToDisplay = useMemo(() => {
    return zones
      .filter((zone) => selectedZones.includes(zone.id))
      .filter((zone) => !!zone.polygon);
  }, [zones, selectedZones]);

  return {
    show,
    zonesForFilter,
    zonesToDisplay,
    selectedZones,
    setSelectedZones,
  };
};
