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
import Raven from 'raven-js';
import '../styles/snap.css';
const ravenConfig  = require('../config/sentry.json');
const isProduction = process.env.NODE_ENV === 'production';

class ErrorBoundry extends React.Component {

  constructor(props) {
    super(props);
    this.state = { error: null };
    if (isProduction) {
      Raven.config(
        ravenConfig.publicKey, {
          release: process.env.VERSION,
          stacktrace: true,
          environment: process.env.NODE_ENV
        }).install();
    }
  }

  componentDidCatch(error, errorInfo) {
    if (isProduction) {
      this.setState({ error });
      Raven.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.error && isProduction) {
      return (
        <div
          className="snap"
          onClick={() => Raven.lastEventId() && Raven.showReportDialog()}
        >
          <div>
            <h3>Noe har gått galt, og vi beklager ulempene dette måtte medføre!</h3>
          </div>
          <p>Våre utviklere er blitt informert om problemet, men fyll gjerne ut en rapport her for å komme med tilleggsinformasjon ved å klikke her.</p>
          <p>Tusen takk for din hjelp!</p>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundry;