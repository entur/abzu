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

  render() {
    const { stopPlaces, handleAddStopPlaceOpen } = this.props;
    const { expandedItem } = this.state;

    return (
      <div>
        <div
          style={{
            padding: 5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '.9em' }}>
            Tilhørende stoppesteder
          </div>
          <FloatingActionButton
            onClick={handleAddStopPlaceOpen}
            mini={true}
            style={{ marginLeft: 20, marginBottom: 10 }}
          >
            <ContentAdd />
          </FloatingActionButton>
        </div>
        <div
          style={{
            maxHeight: 320,
            overflowX: 'auto'
          }}
        >
          {stopPlaces && stopPlaces.length
            ? stopPlaces.map((stopPlace, i) =>
                <StopPlaceListItem
                  key={'stopPlaceItem-' + stopPlace.id}
                  stopPlace={stopPlace}
                  handleExpand={() => this.setState({ expandedItem: i })}
                  handleCollapse={() => this.setState({ expandedItem: -1 })}
                  expanded={expandedItem === i}
                />
              )
            : <div style={{ marginTop: 5 }}>
                <div
                  style={{
                    fontStyle: 'italic',
                    marginLeft: 10,
                    fontSize: '0.9em'
                  }}
                >
                  Ingen stoppesteder
                </div>
                <div
                  style={{
                    fontStyle: 'italic',
                    marginLeft: 10,
                    fontSize: '0.8em',
                    width: '80%',
                    fontWeight: 600
                  }}
                >
                  Et multimodalt stoppested må ha underordnede stoppested for å
                  eksistere.
                </div>
              </div>}
        </div>
      </div>
    );
  }
}

StopPlaceList.propTypes = {
  stopPlaces: PropTypes.arrayOf(PropTypes.object),
  handleAddStopPlaceOpen: PropTypes.func.isRequired
};

export default StopPlaceList;
