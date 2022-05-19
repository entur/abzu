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

import React, { useMemo, useRef } from "react";
import MarkerList from "./MarkerList";
import {
  MapContainer as Lmap,
  TileLayer,
  ZoomControl,
  LayersControl,
  ScaleControl,
} from "react-leaflet";
import { GoogleLayer } from "react-leaflet-google-v2";
import MultiPolylineList from "./PathLink";
import MultimodalStopEdges from "./MultimodalStopEdges";
import StopPlaceGroupList from "./StopPlaceGroupList";
import { MapEvents } from "./MapEvents";
import { WMTSLayer } from "./WMTSLayer";

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
}) => {
  const mapRef = useRef();

  const centerPosition = useMemo(() => {
    if (!position) {
      return [64.349421, 16.809082];
    }
    return Array.isArray(position)
      ? position.map((pos) => Number(pos))
      : [Number(position.lat), Number(position.lng)];
  }, [position]);

  const getCheckedBaseLayerByValue = (value) => activeBaselayer === value;
  const googleApiKey = window.config.googleApiKey;
  const { BaseLayer } = LayersControl;

  return (
    <Lmap
      ref={mapRef}
      style={lmapStyle}
      center={centerPosition}
      className="leaflet-map"
      onZoomEnd={(e) => handleZoomEnd && handleZoomEnd(e)}
      zoom={zoom}
      zoomControl={false}
      minZoom={minZoom || null}
      onDblclick={(e) => onDoubleClick && onDoubleClick(e, mapRef.current)}
      onMoveEnd={(event) => {
        handleMapMoveEnd(event, mapRef.current);
      }}
      onclick={(event) => {
        handleOnClick && handleOnClick(event, mapRef.current);
      }}
    >
      <MapEvents handleBaselayerChanged={handleBaselayerChanged}>
        <LayersControl position="topright">
          <BaseLayer
            checked={getCheckedBaseLayerByValue("OpenStreetMap")}
            name="OpenStreetMap"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom="19"
            />
          </BaseLayer>
          <BaseLayer
            checked={getCheckedBaseLayerByValue("OpenStreetMap Transport")}
            name="OpenStreetMap Transport"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="//{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"
              maxZoom="19"
            />
          </BaseLayer>
          <BaseLayer
            checked={getCheckedBaseLayerByValue("Kartverket topografisk")}
            name="Kartverket topografisk"
          >
            <TileLayer
              attribution='&copy; <a href="http://www.kartverket.no">Kartverket'
              url="https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}"
              maxZoom="19"
            />
          </BaseLayer>
          <BaseLayer
            checked={getCheckedBaseLayerByValue("Kartverket flyfoto")}
            name="Kartverket flyfoto"
          >
            <WMTSLayer baseUrl="https://gatekeeper1.geonorge.no/BaatGatekeeper/gk/gk.nib_web_mercator_wmts_v2" />
          </BaseLayer>
          <BaseLayer
            checked={getCheckedBaseLayerByValue("Google Maps Hydrid")}
            name="Google Maps Hydrid"
          >
            <GoogleLayer
              maxZoom="19"
              googlekey={googleApiKey}
              maptype="HYBRID"
            />
          </BaseLayer>
        </LayersControl>
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
    </Lmap>
  );
};

export default LeafLetMap;
