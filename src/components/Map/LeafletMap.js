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

import React from "react";
import MarkerList from "./MarkerList";
import {
  Map as Lmap,
  TileLayer,
  ZoomControl,
  LayersControl,
  ScaleControl,
} from "react-leaflet";
import { GoogleLayer } from "react-leaflet-google";
import MultiPolylineList from "./PathLink";
import WMTSLayer from "./WMTSLayer";
import MapboxLayer from "./MapboxLayer";
import MultimodalStopEdges from "./MultimodalStopEdges";
import StopPlaceGroupList from "./StopPlaceGroupList";

export default class LeafLetMap extends React.Component {
  getCheckedBaseLayerByValue(value) {
    return this.props.activeBaselayer === value;
  }

  handleBaselayerChanged(element) {
    this.props.handleBaselayerChanged(element.name);
  }

  getCenterPosition(position) {
    if (!position) {
      return [64.349421, 16.809082];
    }
    return Array.isArray(position)
      ? position.map((pos) => Number(pos))
      : [Number(position.lat), Number(position.lng)];
  }

  getLocalGKTToken() {
    let localToken = JSON.parse(localStorage.getItem("ABZU::GKT_TOKEN"));

    if (localToken && localToken.gkt) {
      return localToken.gkt;
    }
    return null;
  }

  getMapboxAccessToken() {
    return `${window.config.mapboxAccessToken}`;
  }

  getMapboxTariffZoneStyle() {
    return `${window.config.mapboxTariffZonesStyle}`;
  }

  render() {
    // NB: this key is owned by rutebanken.official
    const googleApiKey = "AIzaSyBIobnzsLdanPxsH6n1tlySXeeUuMfMM8E";

    const {
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
    } = this.props;

    const { BaseLayer } = LayersControl;

    const lmapStyle = {
      border: "2px solid #eee",
    };

    const centerPosition = this.getCenterPosition(position);
    const mapboxAccessToken = this.getMapboxAccessToken();
    const mapboxTariffZonesStyle = this.getMapboxTariffZoneStyle();

    return (
      <Lmap
        ref="map"
        style={lmapStyle}
        center={centerPosition}
        className="leaflet-map"
        onZoomEnd={(e) => handleZoomEnd && handleZoomEnd(e)}
        zoom={zoom}
        zoomControl={false}
        minZoom={minZoom || null}
        onDblclick={(e) => onDoubleClick && onDoubleClick(e, this.refs.map)}
        onMoveEnd={(event) => {
          handleMapMoveEnd(event, this.refs.map);
        }}
        OnBaselayerChange={this.handleBaselayerChanged.bind(this)}
        onclick={(event) => {
          handleOnClick && handleOnClick(event, this.refs.map);
        }}
      >
        <LayersControl position="topright">
          <BaseLayer
            checked={this.getCheckedBaseLayerByValue("OpenStreetMap")}
            name="OpenStreetMap"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom="19"
            />
          </BaseLayer>
          <BaseLayer
            checked={this.getCheckedBaseLayerByValue("OpenStreetMap Transport")}
            name="OpenStreetMap Transport"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="//{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"
              maxZoom="19"
            />
          </BaseLayer>
          <BaseLayer
            checked={this.getCheckedBaseLayerByValue("Kartverket topografisk")}
            name="Kartverket topografisk"
          >
            <TileLayer
              attribution='&copy; <a href="http://www.kartverket.no">Kartverket'
              url="https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}"
              maxZoom="19"
            />
          </BaseLayer>
          <BaseLayer
            checked={this.getCheckedBaseLayerByValue("Kartverket flyfoto")}
            name="Kartverket flyfoto"
          >
            <WMTSLayer
              gkt={this.getLocalGKTToken()}
              baseURL="https://gatekeeper1.geonorge.no/BaatGatekeeper/gk/gk.nib_web_mercator_wmts_v2"
              zoom={zoom}
            />
          </BaseLayer>
          <BaseLayer
            checked={this.getCheckedBaseLayerByValue("Google Maps Hydrid")}
            name="Google Maps Hydrid"
          >
            <GoogleLayer
              maxZoom="19"
              googlekey={googleApiKey}
              maptype="HYBRID"
            />
          </BaseLayer>
          {mapboxAccessToken && mapboxTariffZonesStyle ? (
            <BaseLayer
              checked={this.getCheckedBaseLayerByValue("Takstsoner")}
              name="Takstsoner"
            >
              <MapboxLayer
                accessToken={mapboxAccessToken}
                style={mapboxTariffZonesStyle}
              />
            </BaseLayer>
          ) : null}
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
      </Lmap>
    );
  }
}
