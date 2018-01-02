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

import AutoComplete from 'material-ui/AutoComplete';
import { withApollo } from 'react-apollo';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { getTariffZones } from '../../graphql/Actions';
import StopPlaceActions from '../../actions/StopPlaceActions';

class AddTariffZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      searchText: ''
    };
  }

  handleUpdate(searchText) {
    this.setState({
      searchText
    });

    if (searchText) {
      const { client } = this.props;

      getTariffZones(client, searchText).then(result => {
        this.setState({
          dataSource: result.data.tariffZones
        });
      });
    }
  }

  getMenuItems(dataSource) {
    const addedTariffZones = this.props.tariffZones.map(tz => tz.id);
    const innerDivStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.8em',
    };

    return dataSource
      .filter(item => addedTariffZones.indexOf(item.id) === -1)
      .map(item => {
      return {
        text: item.name.value,
        item,
        value: (
          <MenuItem
            innerDivStyle={innerDivStyle}
            key={'tz-' + item.id}
            style={{ paddingLeft: 10, paddingRight: 10, width: 'auto' }}
            primaryText={item.name.value}
            secondaryText={item.id}
          />
        )
      }
    });
  }

  handleNewRequest(chosen) {
    if (chosen && chosen.item) {
      this.props.dispatch(
        StopPlaceActions.addTariffZone(chosen.item)
      );
      this.setState({
        searchText: ''
      });
    }
  }

  render() {

    const { dataSource, searchText } = this.state;
    const menuItems = this.getMenuItems(dataSource);
    const { formatMessage } = this.props.intl;

    return (
      <div
        style={{
          background: 'rgba(33, 150, 243, 0)',
          border: '1px dotted',
          padding: 10
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: '0.9em',
            width: '100%',
            marginTop: 10
          }}
        >
          {formatMessage({id: 'add_tariff_zone'})}
        </div>
        <AutoComplete
          floatingLabelText={formatMessage({id: 'tariff_zone_search'})}
          hintText={formatMessage({id: 'tariff_zone_search'})}
          dataSource={menuItems}
          searchText={searchText}
          onUpdateInput={this.handleUpdate.bind(this)}
          filter={AutoComplete.caseInsensitiveFilter}
          maxSearchResults={7}
          onNewRequest={this.handleNewRequest.bind(this)}
          listStyle={{ width: 'auto' }}
          ref="autocomplete"
          fullWidth
        />
      </div>
    );
  }
}

AddTariffZone.propTypes = {
  handleAdd: PropTypes.func
};

const mapStateToProps = ({stopPlace}) => ({
  tariffZones: stopPlace.current.tariffZones
});

export default withApollo(connect(mapStateToProps)(injectIntl(AddTariffZone)));
