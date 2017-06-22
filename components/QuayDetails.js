import React from 'react';
import Code from './Code';
import CompassBearingInfo from './CompassBearingInfo';


class QuayDetails extends React.Component {
  render() {
    const { quay } = this.props;

    if (!quay) return null;

    return (
      <div>
        <span style={{fontWeight: 600}}>{ quay.id }</span>
          <div style={{display: 'flex', padding: 5, textAlign: 'center', width: '100%'}}>
            <Code type="publicCode" value={quay.publicCode}/>
            <Code type="privateCode" value={quay.privateCode}/>
          </div>
        <CompassBearingInfo value={ quay.compassBearing }/>
      </div>
    )
  }
}

export default QuayDetails;