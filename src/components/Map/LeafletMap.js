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

import { useContext, useEffect, useMemo, useState } from "react";
import {
  LayersControl,
  MapContainer,
  ScaleControl,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import { ConfigContext } from "../../config/ConfigContext";
import { FareZones } from "../Zones/FareZones";
import { TariffZones } from "../Zones/TariffZones";
import { KartverketFlyFotoLayer } from "./KartverketFlyFotoLayer";
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
  onMapReady = () => {},
}) => {
  const centerPosition = useMemo(() => {
    if (!position) {
      return [64.349421, 16.809082];
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
      map.setView(centerPosition, zoom);
    }
  }, [centerPosition[0], centerPosition[1], zoom]);

  const { googleApiKey } = useContext(ConfigContext);
  const getCheckedBaseLayerByValue = (value) => activeBaselayer === value;
  const { BaseLayer } = LayersControl;

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
        onDblclick={(e) => onDoubleClick && onDoubleClick(e, map)}
        onClick={(event) => {
          handleOnClick && handleOnClick(event, map);
        }}
        onZoomEnd={(e) => handleZoomEnd && handleZoomEnd(e, map)}
        onMoveEnd={(event) => {
          handleMapMoveEnd(event, map);
        }}
      >
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
            checked={getCheckedBaseLayerByValue("Kartverket topografisk")}
            name="Kartverket topografisk"
          >
            <TileLayer
              attribution='&copy; <a href="http://www.kartverket.no">Kartverket'
              url="https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png"
              maxZoom="19"
            />
          </BaseLayer>
          <BaseLayer
            checked={getCheckedBaseLayerByValue("Kartverket flyfoto")}
            name="Kartverket flyfoto"
          >
            <KartverketFlyFotoLayer />
          </BaseLayer>
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
