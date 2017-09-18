let instance = null;
const rootKey = 'ABZU::settings';
const showExpiredKey = rootKey + '::showExpiredStops';
const showPathLinksKey = rootKey + '::pathLinks';
const showCompassBearingKey = rootKey + '::showCompassBearing';
const showMultimodalEdges = rootKey + '::showMultimodalEdges';
const mapLayerKey = rootKey + '::mapLayer';


class SettingsManager {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  parseBoolean(value, defaultValue) {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return defaultValue;
  }

  getShowExpiredStops() {
    return this.parseBoolean(localStorage.getItem(showExpiredKey), false);
  }

  setShowExpiredStops(value) {
    localStorage.setItem(showExpiredKey, value);
  }

  getShowPathLinks() {
    return this.parseBoolean(localStorage.getItem(showPathLinksKey), true);
  }

  setShowPathLinks(value) {
    localStorage.setItem(showPathLinksKey, value);
  }

  getShowCompassBearing() {
    return this.parseBoolean(localStorage.getItem(showCompassBearingKey), true);
  }

  setShowCompassBearing(value) {
    localStorage.setItem(showCompassBearingKey, value);
  }

  setShowMultimodalEdges(value) {
    localStorage.setItem(showMultimodalEdges, value);
  }

  getShowMultimodalEdges() {
    return this.parseBoolean(localStorage.getItem(showMultimodalEdges), true);
  }

  getMapLayer() {
    return localStorage.getItem(mapLayerKey) || 'OpenStreetMap';
  }

  setMapLayer(value) {
    localStorage.setItem(mapLayerKey, value);
  }

}

export default SettingsManager;
