import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StopPlaceListItem from './StopPlaceListItem';

class StopPlaceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedItem: -1
    };
  }

  render() {
    const { stopPlaces } = this.props;
    const { expandedItem } = this.state;

    return (
      <div>
        <div style={{ padding: 5, fontWeight: 600, fontSize: '1em' }}>
          Tilhørende stoppesteder
        </div>
        <div>
          {stopPlaces.map( (stopPlace, i) =>
            <StopPlaceListItem
              key={stopPlace.id}
              stopPlace={stopPlace}
              handleExpand={() => this.setState({expandedItem: i})}
              handleCollapse={() => this.setState({expandedItem: -1})}
              expanded={expandedItem === i}
            />
          )}
        </div>
      </div>
    );
  }
}

StopPlaceList.propTypes = {
  stopPlaces: PropTypes.arrayOf(PropTypes.object)
};

export default StopPlaceList;
