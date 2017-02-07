import L from 'leaflet'

const WMTSPlugin = L.TileLayer.extend({

  defaultWmtsParams: {
    service: 'WMTS',
    request: 'GetTile',
    version: '1.1.1',
    style: 'default',
    format: 'image/png',
    transparent: "false",
    tilematrixSet: "default028mm",
    layers: "toporaster2",
  },

  initialize: function (url, options) {

    this._url = url;
    var wmtsParams = L.extend({}, this.defaultWmtsParams);
    var tileSize = options.tileSize || this.options.tileSize;

    if (options.detectRetina && L.Browser.retina || isRetinaDisplay) {
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
    this._crs = L.CRS.EPSG3857 //this.options.crs || map.options.crs;
    L.TileLayer.prototype.onAdd.call(this, map);

    console.log(this._crs)

  },

  getTileUrl: function (startPoint) {
    let map = this._map;
    let tileSize = this.options.tileSize;
    let nwPoint = startPoint.multiplyBy(tileSize);

    nwPoint.x+=1;
    nwPoint.y-=1;

    let sePoint = nwPoint.add(new L.Point(tileSize, tileSize));
    let zoom = this._tileZoom;
    let nw = this._crs.project(this._map.unproject(nwPoint, zoom));
    let se = this._crs.project(this._map.unproject(sePoint, zoom));
    let tilewidth = se.x-nw.x;

    let ident = this.matrixIds[zoom].identifier;
    let X0 = this.matrixIds[zoom].topLeftCorner.lng;
    let Y0 = this.matrixIds[zoom].topLeftCorner.lat;
    let tilecol=Math.floor((nw.x-X0)/tilewidth);
    let tilerow=-Math.floor((nw.y-Y0)/tilewidth);

    let url = L.Util.template(this._url, {s: this._getSubdomain(startPoint)});

    let bounds = map.getBounds()

    let boundingBox = [
      bounds.getSouthWest().lng,
      bounds.getSouthWest().lat,
      bounds.getNorthEast().lng,
      bounds.getNorthEast().lat
    ]

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
        topLeftCorner : new L.LatLng(20037508.3428,-20037508.3428)
      };
    }

    return matrixIds3857;
  }
});

function isRetinaDisplay() {
  if (window.matchMedia) {
    var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
    return (mq && mq.matches || (window.devicePixelRatio > 1));
  }
}

export default WMTSPlugin

