import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StopPlaceListItem from './StopPlaceListItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

class StopPlaceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedItem: -1
    };
  }

  handleAddStopPlace() {
    console.log("Adding");
  }

  render() {
    const { stopPlaces } = this.props;
    const { expandedItem } = this.state;

    return (
      <div>
        <div style={{ padding: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{fontWeight: 600, fontSize: '.9em'}}>Tilhørende stoppesteder</div>
          <FloatingActionButton
            onClick={this.handleAddStopPlace.bind(this)}
            mini={true}
            style={{ marginLeft: 20, marginBottom: 10 }}
          >
            <ContentAdd/>
          </FloatingActionButton>
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
