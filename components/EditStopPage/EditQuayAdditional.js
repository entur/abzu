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
