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

import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { connect } from 'react-redux';
import FacilitiesQuayTab from './FacilitiesQuayTab';
import AccessiblityQuayTab from './AcessibilityQuayTab';
import { injectIntl } from 'react-intl';

class EditQuayAdditional extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
    };
  }

  handleTabOnChange = value => {
    this.setState({
      activeTabIndex: value,
    });
  };

  render() {
    const { intl, quay, index, disabled } = this.props;
    const { formatMessage } = intl;

    const style = {
      background: '#fff',
      overflowX: 'hidden',
    };

    const tabStyle = {
      color: '#000',
      fontSize: '0.7em',
      fontWeight: 600,
      marginTop: -10,
    };

    const { activeTabIndex } = this.state;

    return (
      <div style={style} id="additional">
        <Tabs
          onChange={this.handleTabOnChange.bind(this)}
          value={activeTabIndex}
          tabItemContainerStyle={{ backgroundColor: '#fff', marginTop: -5 }}
        >
          <Tab
            style={tabStyle}
            label={formatMessage({ id: 'accessibility' })}
            value={0}
          >
            <AccessiblityQuayTab
              intl={intl}
              quay={quay}
              index={index}
              disabled={disabled}
            />
          </Tab>
          <Tab
            style={tabStyle}
            label={formatMessage({ id: 'facilities' })}
            value={1}
          >
            <FacilitiesQuayTab
              intl={intl}
              quay={quay}
              index={index}
              disabled={disabled}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  focusedElement: state.mapUtils.focusedElement,
  stopPlace: state.stopPlace.current,
});

export default injectIntl(connect(mapStateToProps)(EditQuayAdditional));
