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

import debounce from "lodash.debounce";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import Map, {
  MapLayerMouseEvent,
  MapRef,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import { useNavigate } from "react-router-dom";
import { StopPlaceActions, UserActions } from "../../../actions";
import { getNeighbourStops } from "../../../actions/TiamatActions";
import { ConfigContext, MapConfig } from "../../../config/ConfigContext";
import AppRoutes from "../../../routes";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { AddElementFab } from "./controls/AddElementFab";
import { MapControls } from "./controls/MapControls";
import { FareZonesLayer } from "./layers/FareZonesLayer";
import { MultimodalEdgesLayer } from "./layers/MultimodalEdgesLayer";
import { PathLinkLayer } from "./layers/PathLinkLayer";
import { StopGroupLayer } from "./layers/StopGroupLayer";
import { TariffZonesLayer } from "./layers/TariffZonesLayer";
import { BoardingPositionMarkers } from "./markers/BoardingPositionMarkers";
import { NeighbourMarkers } from "./markers/NeighbourMarkers";
import { ParkingMarkers } from "./markers/ParkingMarkers";
import { QuayMarkers } from "./markers/QuayMarkers";
import { StopPlaceMarker } from "./markers/StopPlaceMarker";
import { buildMaplibreStyle } from "./tile-sources/buildMaplibreStyle";

const NEIGHBOUR_STOPS_MIN_ZOOM = 13;

const DEFAULT_MAP_CONFIG: MapConfig = {
  baseLayers: [
    {
      name: "OpenStreetMap",
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    },
  ],
  defaultBaseLayer: "OpenStreetMap",
  center: [64.349421, 16.809082],
  zoom: 6,
};

export const ModernEditStopMap = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const mapRef = useRef<MapRef>(null);
  const { mapConfig } = useContext(ConfigContext);
  const config = mapConfig ?? DEFAULT_MAP_CONFIG;

  const centerPosition = useAppSelector(
    (state) => state.stopPlace.centerPosition as [number, number],
  );
  const zoom = useAppSelector((state) => state.stopPlace.zoom as number);
  const activeBaseLayer = useAppSelector(
    (state) => (state.user as any).activeBaselayer as string,
  );

  const currentStopId = useAppSelector(
    (state) => (state.stopPlace.current as any)?.id as string | undefined,
  );
  const currentLocation = useAppSelector(
    (state) =>
      (state.stopPlace.current as any)?.location as
        | [number, number]
        | undefined,
  );
  const currentGroupId = useAppSelector(
    (state) =>
      (state as any).stopPlacesGroup?.current?.id as string | undefined,
  );
  const groupCenterPosition = useAppSelector(
    (state) =>
      (state as any).stopPlacesGroup?.centerPosition as
        | [number, number]
        | undefined,
  );
  const showExpiredStops = useAppSelector(
    (state) => (state.stopPlace as any).showExpiredStops as boolean,
  );
  const isCreatingNewStop = useAppSelector(
    (state) => (state.user as any).isCreatingNewStop as boolean,
  );

  // Ref so the stable debounce callback always reads the latest values
  const neighbourStateRef = useRef({ currentStopId, showExpiredStops });
  useEffect(() => {
    neighbourStateRef.current = { currentStopId, showExpiredStops };
  }, [currentStopId, showExpiredStops]);

  const initialViewState = useMemo(
    () => ({
      latitude: centerPosition[0],
      longitude: centerPosition[1],
      zoom,
    }),
    // Intentionally only used as the one-time initial value — not reactive
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleMapLoad = useCallback(() => {
    if (mapRef.current) {
      dispatch(StopPlaceActions.setActiveMap(mapRef.current.getMap()));
    }
  }, [dispatch]);

  const handleMoveEnd = useMemo(
    () =>
      debounce((event: ViewStateChangeEvent) => {
        const { latitude, longitude, zoom: newZoom } = event.viewState;
        dispatch(UserActions.setCenterAndZoom([latitude, longitude], newZoom));

        if (newZoom > NEIGHBOUR_STOPS_MIN_ZOOM) {
          const map = mapRef.current?.getMap();
          if (map) {
            const {
              currentStopId: ignoreId,
              showExpiredStops: includeExpired,
            } = neighbourStateRef.current;
            dispatch(
              getNeighbourStops(ignoreId, map.getBounds(), includeExpired),
            );
          }
        } else {
          dispatch(UserActions.removeStopsNearbyForOverview());
        }
      }, 500),
    // mapRef and neighbourStateRef are stable refs — intentionally excluded
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch],
  );

  useEffect(() => {
    return () => {
      handleMoveEnd.cancel();
    };
  }, [handleMoveEnd]);

  useEffect(() => {
    if (!currentStopId || !currentLocation || !mapRef.current) return;
    const [lat, lng] = currentLocation;
    mapRef.current.flyTo({ center: [lng, lat], zoom: 15, duration: 800 });
  }, [currentStopId]);

  useEffect(() => {
    if (!currentGroupId || !groupCenterPosition || !mapRef.current) return;
    const [lat, lng] = groupCenterPosition;
    mapRef.current.flyTo({ center: [lng, lat], zoom: 14, duration: 800 });
    // groupCenterPosition is included so re-navigating to the same group (same currentGroupId)
    // still triggers flyTo — the reducer always produces a new array reference on fetch.
  }, [currentGroupId, groupCenterPosition]);

  // Ref so the stable callback always reads the latest isCreatingNewStop value
  const isCreatingNewStopRef = useRef(isCreatingNewStop);
  useEffect(() => {
    isCreatingNewStopRef.current = isCreatingNewStop;
  }, [isCreatingNewStop]);

  const handleDblClick = useCallback(
    async (event: MapLayerMouseEvent) => {
      if (!isCreatingNewStopRef.current) return;
      const { lat, lng } = event.lngLat;
      // Await so that CREATED_NEW_STOP is dispatched (and newStop is in Redux)
      // before navigating — StopPlace.tsx guards against null stopPlace on mount.
      await dispatch(StopPlaceActions.createNewStop({ lat, lng }));
      dispatch(UserActions.clearNewStopCreationMode());
      navigate(`/${AppRoutes.STOP_PLACE}/new`);
    },
    // navigate and dispatch are stable; isCreatingNewStopRef is a stable ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, navigate],
  );

  const mapStyle = useMemo(
    () => buildMaplibreStyle(config, activeBaseLayer),
    [config, activeBaseLayer],
  );

  const activeLayerMaxZoom = useMemo(() => {
    const layer =
      config.baseLayers.find((l) => l.name === activeBaseLayer) ??
      config.baseLayers[0];
    return layer?.maxZoom ?? 20;
  }, [config, activeBaseLayer]);

  return (
    <div
      style={{
        position: "fixed",
        top: 64,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
      }}
    >
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
        onLoad={handleMapLoad}
        onMoveEnd={handleMoveEnd}
        onDblClick={handleDblClick}
        doubleClickZoom={!isCreatingNewStop}
        maxZoom={activeLayerMaxZoom}
        pitchWithRotate={false}
        dragRotate={false}
      >
        <MapControls />
        <AddElementFab />
        <FareZonesLayer />
        <TariffZonesLayer />
        <StopGroupLayer />
        <MultimodalEdgesLayer />
        <PathLinkLayer />
        <NeighbourMarkers />
        <StopPlaceMarker />
        <QuayMarkers />
        <ParkingMarkers />
        <BoardingPositionMarkers />
      </Map>
    </div>
  );
};
