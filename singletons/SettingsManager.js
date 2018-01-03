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


let instance = null;

const rootKey = 'ABZU::settings';
const showExpiredKey = rootKey + '::showExpiredStops';
const showPathLinksKey = rootKey + '::pathLinks';
const showCompassBearingKey = rootKey + '::showCompassBearing';
const showMultimodalEdges = rootKey + '::showMultimodalEdges';
const mapLayerKey = rootKey + '::mapLayer';
const showPublicCodeKey = rootKey + '::showPublicCode';

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

  getShowPublicCode() {
    return this.parseBoolean(localStorage.getItem(showPublicCodeKey), true);
  }

  setShowPublicCode(value) {
    localStorage.setItem(showPublicCodeKey, value);
  }

}

export default SettingsManager;
