import React from 'react';
import QuayDetails from './QuayDetails';

class MergeQuaysDetails extends React.Component {

  render() {

    const { merginQuays } = this.props;

    if (!merginQuays) return null;

    return (
      <div style={{color: '#000', padding: 10, display: 'flex', justifyContent: 'space-between'}}>
          <QuayDetails
            key="from_quay"
            quay={merginQuays.fromQuay}
          />
        =>
        <QuayDetails
          key="to_quay"
          quay={merginQuays.toQuay}
        />

      </div>
    )
  }
}

export default MergeQuaysDetails;