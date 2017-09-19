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
import Code from './Code';
import CompassBearingInfo from './CompassBearingInfo';
import { injectIntl } from 'react-intl';

class QuayDetails extends React.Component {
  render() {

    const { quay, isSource, intl, hideSourceOriginLabel } = this.props;
    const { formatMessage } = intl;

    if (!quay) return null;

    let message = isSource
      ? formatMessage({id: 'source'})
      : formatMessage({id: 'target'});

    return (
      <div>
        <div>
          {!hideSourceOriginLabel && <span style={{fontWeight: 600, marginRight: 5}}>{message}:</span>}
          <span>{ quay.id }</span>
          </div>
          <div style={{display: 'flex', padding: 5, textAlign: 'center', width: '100%'}}>
            <Code type="publicCode" value={quay.publicCode}/>
            <Code type="privateCode" value={quay.privateCode}/>
          </div>
        <CompassBearingInfo value={ quay.compassBearing }/>
      </div>
    )
  }
}

export default injectIntl(QuayDetails);
