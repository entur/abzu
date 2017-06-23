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