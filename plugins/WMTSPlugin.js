import L from 'leaflet'

const WMTSPlugin = L.TileLayer.extend({

  defaultWmtsParams: {
    service: 'WMTS',
    request: 'GetTile',
    version: '1.1.1',
    style: 'default',
    tilematrixSet: '',
    format: 'image/png',
    transparent: "false",
    tilematrixset: "default028mm",
  },

  initialize: function (url, options) {
    this._url = url;
    var wmtsParams = L.extend({}, this.defaultWmtsParams);
    var tileSize = options.tileSize || this.options.tileSize;
    if (options.detectRetina && L.Browser.retina) {
      wmtsParams.width = wmtsParams.height = tileSize * 2;
    } else {
      wmtsParams.width = wmtsParams.height = tileSize;
    }
    for (var i in options) {
      if (!this.options.hasOwnProperty(i) && i!="matrixIds") {
        wmtsParams[i] = options[i];
      }
    }
    this.wmtsParams = wmtsParams;
    this.matrixIds = options.matrixIds || this.getDefaultMatrix();
    L.setOptions(this, options);
  },

  onAdd: function (map) {
    this._crs = this.options.crs || map.options.crs;
    L.TileLayer.prototype.onAdd.call(this, map);
  },

  getTileUrl: function (tilePoint) {
    var map = this._map;
    var crs = L.CRS.EPSG3857;
    var tileSize = 256;
    var nwPoint = tilePoint.multiplyBy(tileSize);
    nwPoint.x+=1;
    nwPoint.y-=1;
    var sePoint = nwPoint.add(new L.Point(tileSize, tileSize));
    var zoom =  (typeof map._animateToZoom == 'undefined') ? map.getZoom() : map._animateToZoom;
    var nw = crs.project(map.unproject(nwPoint, zoom))
    var se = crs.project(map.unproject(sePoint, zoom))
    var tilewidth = se.x-nw.x;
    var ident = this.matrixIds[zoom].identifier;
    var X0 = this.matrixIds[zoom].topLeftCorner.lng;
    var Y0 = this.matrixIds[zoom].topLeftCorner.lat;
    var tilecol=Math.floor((nw.x-X0)/tilewidth);
    var tilerow=-Math.floor((nw.y-Y0)/tilewidth);
    var url = L.Util.template(this._url, {s: this._getSubdomain(tilePoint)});

    let bounds = map.getBounds()

    let boundingBox = [
      bounds.getSouthWest().lng,
      bounds.getSouthWest().lat,
      bounds.getNorthEast().lng,
      bounds.getNorthEast().lat
    ]

    let coordinates = map.unproject(tilePoint.multiplyBy(256), zoom)

    return url + L.Util.getParamString(this.wmtsParams, url) + "&tilematrix=" + ident + "&tilerow=" + tilerow +"&tilecol=" + tilecol + "&bbox=" + boundingBox.join(',');
  },

  setParams: function (params, noRedraw) {
    L.extend(this.wmtsParams, params);
    if (!noRedraw) {
      this.redraw();
    }
    return this;
  },

  getDefaultMatrix : function () {
    var matrixIds3857 = new Array(22);
    for (var i= 0; i<22; i++) {
      matrixIds3857[i]= {
        identifier    : "" + i,
        topLeftCorner : new L.LatLng(20037508.34, -20037508.34)
      };
    }
    return matrixIds3857;
  }
});

export default WMTSPlugin

