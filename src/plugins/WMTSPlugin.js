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

import L from "leaflet";

const WMTSPlugin = L.TileLayer.extend({
  defaultWmtsParams: {
    service: "WMTS",
    request: "GetTile",
    version: "1.1.1",
    style: "default",
    format: "image/png",
    transparent: "false",
    tilematrixSet: "default028mm",
    layers: "toporaster2",
  },

  initialize: function (url, options) {
    this._url = url;
    var wmtsParams = L.extend({}, this.defaultWmtsParams);
    var tileSize = options.tileSize || this.options.tileSize;

    wmtsParams.width = wmtsParams.height = tileSize;

    for (var i in options) {
      if (!this.options.hasOwnProperty(i) && i !== "matrixIds") {
        wmtsParams[i] = options[i];
      }
    }
    this.wmtsParams = wmtsParams;
    this.matrixIds = options.matrixIds || this.getDefaultMatrix();
    options.maxZoom = 19;
    L.setOptions(this, options);
  },

  onAdd: function (map) {
    this._crs = this.options.crs || map.options.crs;
    L.TileLayer.prototype.onAdd.call(this, map);
  },

  getTileUrl: function (startPoint) {
    let tileSize = this.options.tileSize;
    let nwPoint = startPoint.multiplyBy(tileSize);

    nwPoint.x += 1;
    nwPoint.y -= 1;

    let sePoint = nwPoint.add(new L.Point(tileSize, tileSize));
    let zoom = this._tileZoom;
    let nw = this._crs.project(this._map.unproject(nwPoint, zoom));
    let se = this._crs.project(this._map.unproject(sePoint, zoom));
    let tilewidth = se.x - nw.x;

    let identifier = this.matrixIds[zoom].identifier;
    let X0 = this.matrixIds[zoom].topLeftCorner.lng;
    let Y0 = this.matrixIds[zoom].topLeftCorner.lat;
    let tilecol = Math.floor((nw.x - X0) / tilewidth);
    let tilerow = -Math.floor((nw.y - Y0) / tilewidth);

    let url = L.Util.template(this._url, { s: this._getSubdomain(startPoint) });

    return (
      url +
      L.Util.getParamString(this.wmtsParams, url) +
      "&tilematrix=" +
      identifier +
      "&tilerow=" +
      tilerow +
      "&tilecol=" +
      tilecol
    );
  },

  setParams: function (params, noRedraw) {
    L.extend(this.wmtsParams, params);
    if (!noRedraw) {
      this.redraw();
    }
    return this;
  },

  getDefaultMatrix: function (zoom) {
    var matrixIds3857 = new Array(22);
    for (var i = 0; i < 22; i++) {
      matrixIds3857[i] = {
        identifier: "" + i,
        topLeftCorner: new L.LatLng(20037508.34, -20037508.34),
      };
    }

    return matrixIds3857;
  },
});

export default WMTSPlugin;
