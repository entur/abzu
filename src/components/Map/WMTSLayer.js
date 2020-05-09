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

import React from 'react';
import PropTypes from 'prop-types';
import { TileLayer } from 'react-leaflet';
import reactWMTSLayer from '../../plugins/WMTSPlugin';

export default class WMTSLayer extends TileLayer {
  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    gkt: PropTypes.string,
  };

  componentWillMount() {
    super.componentWillMount();
    const { baseURL, gkt } = this.props;

    if (!gkt) return null;

    this.leafletElement = new reactWMTSLayer(baseURL, {
      gkt: gkt,
      layers: 'toporaster2',
    });
  }
}
