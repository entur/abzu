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


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StopPlaceListItem from './StopPlaceListItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { injectIntl } from 'react-intl';
import Loader from '../Dialogs/Loader';

class StopPlaceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedItem: -1
    };
  }

  render() {
    const { stopPlaces, handleAddStopPlaceOpen, intl, disabled, isLoading } = this.props;
    const { formatMessage } = intl;
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
            {formatMessage({id: 'children_of_parent_stop_place'})}
            {isLoading ? <Loader/> : null}
          </div>
          <FloatingActionButton
            onClick={handleAddStopPlaceOpen}
            disabled={disabled}
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
                  disabled={disabled}
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
                  {formatMessage({id: 'parent_stop_place__no_children'})}
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
                  {formatMessage({id: 'parent_stop_place_requires_children'})}
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

export default injectIntl(StopPlaceList);
