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

import L from 'leaflet'
import React from 'react';
import PropTypes from 'prop-types';
import { GridLayer } from 'react-leaflet';

export default class MapboxLayer extends GridLayer {

  static propTypes = {
    accessToken: PropTypes.string.isRequired,
    style: PropTypes.string.isRequired,
  };

  createLeafletElement() {
    const styleString = this.props.style;
    const { user, styleId } = this.parseStyleString(styleString);

    return L.tileLayer(
      'https://api.mapbox.com/styles/v1/' + user + '/' + styleId + '/tiles/{z}/{x}/{y}?access_token=' + this.props.accessToken, {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
  }

  parseStyleString(style) {
    // Assuming style is configured as mapbox://
    let index = style.indexOf("mapbox://");
    var fields = style.split("/");
    const user = fields[3];
    const styleId = fields[4];
    return { user, styleId }
  }
}
