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

import { ComponentToggle } from "@entur/react-component-toggle";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  LayersControl,
  MapContainer,
  ScaleControl,
  ZoomControl,
} from "react-leaflet";
import { ConfigContext } from "../../config/ConfigContext";
import { FareZonesLayer } from "../modern/Map/FareZonesLayer";
import { FareZones } from "../Zones/FareZones";
import { TariffZones } from "../Zones/TariffZones";
import { DynamicTileLayer } from "./DynamicTileLayer";
import { MapControls } from "./MapControls";
import { defaultCenterPosition, defaultOSMTileLayer } from "./mapDefaults";
import { MapEvents } from "./MapEvents";
import MarkerList from "./MarkerList";
import MultimodalStopEdges from "./MultimodalStopEdges";
import MultiPolylineList from "./PathLink";
import StopPlaceGroupList from "./StopPlaceGroupList";

const lmapStyle = {
  border: "2px solid #eee",
};

export const LeafLetMap = ({
  position,
  zoom,
  handleDragEnd,
  handleChangeCoordinates,
  handleOnClick,
  minZoom,
  handleSetCompassBearing,
  markers,
  dragableMarkers,
  handleMapMoveEnd,
  onDoubleClick,
  handleZoomEnd,
  activeBaselayer,
  handleBaselayerChanged,
  activeOverlays = [],
  handleOverlaysChanged,
  onMapReady = () => {},
  uiMode,
}) => {
  const { mapConfig } = useContext(ConfigContext);
  const defaultBaseLayers = [defaultOSMTileLayer];

  const centerPosition = useMemo(() => {
    if (!position) {
      return mapConfig?.center || defaultCenterPosition;
    }
    return Array.isArray(position)
      ? position.map((pos) => Number(pos))
      : [Number(position.lat), Number(position.lng)];
  }, [position]);

  const [map, setMap] = useState();

  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      map.setView(centerPosition, zoom, { animate: true, duration: 0.25 });
    }
  }, [centerPosition[0], centerPosition[1], zoom]);

  const getCheckedBaseLayerByValue = (value) => activeBaselayer === value;
  const getCheckedOverlayByValue = (value) =>
    Array.isArray(activeOverlays) && activeOverlays.includes(value);

  const handleOverlayAdd = (name) => {
    if (!handleOverlaysChanged) return;
    const next = activeOverlays.includes(name)
      ? activeOverlays
      : [...activeOverlays, name];
    handleOverlaysChanged(next);
  };

  const handleOverlayRemove = (name) => {
    if (!handleOverlaysChanged) return;
    handleOverlaysChanged(activeOverlays.filter((n) => n !== name));
  };

  const { BaseLayer, Overlay } = LayersControl;

  return (
    <MapContainer
      ref={(instance) => instance && setMap(instance)}
      style={lmapStyle}
      center={centerPosition}
      className="leaflet-map"
      zoom={zoom}
      zoomControl={false}
      minZoom={minZoom || null}
    >
      <MapEvents
        handleBaselayerChanged={handleBaselayerChanged}
        handleOverlayAdd={handleOverlayAdd}
        handleOverlayRemove={handleOverlayRemove}
        onDblclick={(e) => onDoubleClick && onDoubleClick(e, map)}
        onClick={(event) => {
          handleOnClick && handleOnClick(event, map);
        }}
        onZoomEnd={(e) => handleZoomEnd && handleZoomEnd(e, map)}
        onMoveEnd={(event) => {
          handleMapMoveEnd(event, map);
        }}
      >
        {uiMode === "modern" ? (
          <>
            {/* Render active base layer directly without LayersControl in modern UI */}
            {(mapConfig?.tiles || defaultTiles)
              .filter((tile) => getCheckedBaseLayerByValue(tile.name))
              .map((tile) =>
                tile.component ? (
                  <ComponentToggle
                    key={tile.name}
                    feature={tile.componentName}
                    componentProps={tile}
                  />
                ) : (
                  <DynamicTileLayer
                    key={tile.name}
                    attribution={tile.attribution}
                    url={tile.url}
                    maxZoom={tile.maxZoom}
                    maxNativeZoom={tile.maxNativeZoom}
                  />
                ),
              )}
            <MapControls />
            <FareZonesLayer />
          </>
        ) : (
          <>
            <LayersControl position="topright">
              {(mapConfig?.tiles || defaultTiles).map((tile) => {
                return (
                  <BaseLayer
                    key={tile.name}
                    checked={getCheckedBaseLayerByValue(tile.name)}
                    name={tile.name}
                  >
                    {tile.component ? (
                      <ComponentToggle
                        feature={tile.componentName}
                        componentProps={tile}
                      />
                    ) : (
                      <DynamicTileLayer
                        attribution={tile.attribution}
                        url={tile.url}
                        maxZoom={tile.maxZoom}
                      />
                    )}
                  </BaseLayer>
                );
              })}
            </LayersControl>
            <FareZones position="topright" />
            <TariffZones position="topright" />
          </>
        )}
        <LayersControl position="topright">
          {(mapConfig?.baseLayers || defaultBaseLayers).map((layer) => {
            return (
              <BaseLayer
                key={layer.name}
                checked={getCheckedBaseLayerByValue(layer.name)}
                name={layer.name}
              >
                {layer.component ? (
                  <ComponentToggle
                    feature={layer.componentName}
                    componentProps={layer}
                  />
                ) : (
                  <DynamicTileLayer
                    attribution={layer.attribution}
                    url={layer.url}
                    maxZoom={layer.maxZoom}
                    maxNativeZoom={layer.maxNativeZoom}
                  />
                )}
              </BaseLayer>
            );
          })}
          {mapConfig?.overlays?.map((overlay) => (
            <Overlay
              key={overlay.name}
              name={overlay.name}
              checked={getCheckedOverlayByValue(overlay.name)}
            >
              {overlay.component ? (
                <ComponentToggle
                  feature={overlay.componentName}
                  componentProps={overlay}
                />
              ) : (
                <DynamicTileLayer
                  attribution={overlay.attribution}
                  url={overlay.url}
                  maxZoom={overlay.maxZoom}
                  maxNativeZoom={overlay.maxNativeZoom}
                />
              )}
            </Overlay>
          ))}
        </LayersControl>
        <FareZones position="topright" />
        <TariffZones position="topright" />
        <ScaleControl imperial={false} position="bottomright" />
        <ZoomControl position="bottomright" />
        <MarkerList
          changeCoordinates={handleChangeCoordinates}
          markers={markers}
          handleDragEnd={handleDragEnd}
          dragableMarkers={dragableMarkers}
          handleSetCompassBearing={handleSetCompassBearing}
        />
        <MultimodalStopEdges stops={markers} />
        <MultiPolylineList />
        <StopPlaceGroupList />
      </MapEvents>
    </MapContainer>
  );
};

export default LeafLetMap;
