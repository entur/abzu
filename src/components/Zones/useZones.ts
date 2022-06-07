import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { TariffZone } from "../../models/TariffZone";

export interface Options<T extends TariffZone> {
  showSelector: (state: any) => boolean;
  zonesForFilterSelector: (state: any) => T[];
  zonesSelector: (state: any) => T[];
  getZonesForFilterAction: () => (
    dispatch: any,
    getState: any
  ) => Promise<void>;
  getZonesAction: (
    ids: string[]
  ) => (dispatch: any, getState: any) => Promise<void>;
}

export const useZones = <T extends TariffZone>({
  showSelector,
  zonesForFilterSelector,
  zonesSelector,
  getZonesForFilterAction,
  getZonesAction,
}: Options<T>) => {
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

  const dispatch = useDispatch();

  const show = useSelector<any, boolean>(showSelector);
  const zonesForFilter = useSelector<any, T[]>(zonesForFilterSelector);
  const zones = useSelector<any, T[]>(zonesSelector);

  useEffect(() => {
    const zoneIds = selectedZones.filter(
      (id) => !zones.some((zone) => zone.id === id)
    );

    if (zoneIds.length > 0) {
      dispatch(
        getZonesAction(
          selectedZones.filter((id) => !zones.some((zone) => zone.id === id))
        ) as unknown as AnyAction
      );
    }
  }, [selectedZones]);

  useEffect(() => {
    if (show) {
      dispatch(getZonesForFilterAction() as unknown as AnyAction);
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
