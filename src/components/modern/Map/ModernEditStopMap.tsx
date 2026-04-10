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
import Map, { MapRef, ViewStateChangeEvent } from "react-map-gl/maplibre";
import { StopPlaceActions, UserActions } from "../../../actions";
import { getNeighbourStops } from "../../../actions/TiamatActions";
import { ConfigContext, MapConfig } from "../../../config/ConfigContext";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { MapControls } from "../../Map/MapControls";
import { MultimodalEdgesLayer } from "./layers/MultimodalEdgesLayer";
import { PathLinkLayer } from "./layers/PathLinkLayer";
import { BoardingPositionMarkers } from "./markers/BoardingPositionMarkers";
import { NeighbourMarkers } from "./markers/NeighbourMarkers";
import { ParkingMarkers } from "./markers/ParkingMarkers";
import { QuayMarkers } from "./markers/QuayMarkers";
import { StopPlaceMarker } from "./markers/StopPlaceMarker";
import { buildMaplibreStyle } from "./tile-sources/buildMaplibreStyle";

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
  const showExpiredStops = useAppSelector(
    (state) => (state.stopPlace as any).showExpiredStops as boolean,
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

        if (newZoom > 14) {
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

  const mapStyle = useMemo(
    () => buildMaplibreStyle(config, activeBaseLayer),
    [config, activeBaseLayer],
  );

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
        pitchWithRotate={false}
        dragRotate={false}
      >
        <MapControls />
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
