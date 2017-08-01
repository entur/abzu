import React from 'react';
import QuayDetails from './QuayDetails';

class MergeQuaysDetails extends React.Component {

  render() {

    const { merginQuays } = this.props;

    if (!merginQuays) return null;

    return (
      <div style={{color: '#000', padding: 10, display: 'flex', justifyContent: 'space-between', marginBottom: 5}}>
          <QuayDetails
            key="from_quay"
            isSource={true}
            quay={merginQuays.fromQuay}
          />
        =>
        <QuayDetails
          key="to_quay"
          quay={merginQuays.toQuay}
          isSource={false}
        />
      </div>
    )
  }
}

export default MergeQuaysDetails;