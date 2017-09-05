import React, { Component } from 'react';
import StopPlaceListItemQuayItem from './StopPlaceListItemQuayItem';

class StopPlaceListItemQuays extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expandedQuay: -1
    }
  }

  render() {
    const { quays, formatMessage } = this.props;
    const { expandedQuay } = this.state;

    return (
      <div style={{width: '90%', margin: 'auto'}}>
        <span style={{fontWeight: 600, fontSize: '0.8em', textTransform: 'capitalize'}}>
          {formatMessage({id: 'quays'})}
        </span>
        {quays.map( (quay, i) =>
          <StopPlaceListItemQuayItem
            key={quay.id}
            quay={quay}
            expanded={expandedQuay === i}
            handleCollapse={() => this.setState({expandedQuay: -1})}
            handleExpand={() => this.setState({expandedQuay: i})}
          />
        )}
      </div>
    );
  }
}

export default StopPlaceListItemQuays;
