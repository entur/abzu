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
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

class GeneralReportFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null
    };
  }

  render() {
    const {
      formatMessage,
      hasParking,
      handleCheckboxChange
    } = this.props;

    const { open, anchorEl } = this.state;

    const menuItemsStyle = {display: 'flex', alignItems: 'center'};

    return (
      <div style={{marginTop: 10, marginLeft: 5}}>
        <RaisedButton
          onClick={e => {
            this.setState({
              open: true,
              anchorEl: e.currentTarget
            })
          }}
          style={{transform: 'scale(0.9)'}}
          label={formatMessage({id: 'filters_general'})}
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          onRequestClose={() => {
            this.setState({ open: false });
          }}
        >
          <Menu>
              <MenuItem style={menuItemsStyle}>
                  <Checkbox
                      label={formatMessage({ id: 'has_parking' })}
                      labelPosition="right"
                      labelStyle={{ width: 'auto', fontSize: '0.9em' }}
                      checked={hasParking}
                      onCheck={(e, value) => {
                          handleCheckboxChange('hasParking', value);
                      }}
                      style={{ marginTop: 10 }}
                  />
              </MenuItem>
          </Menu>
        </Popover>
      </div>
    );
  }
}

export default GeneralReportFilters;
