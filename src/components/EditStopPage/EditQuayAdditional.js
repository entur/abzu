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

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import AccessibilityQuayTab from "./AccessibilityAssessment/AccessibilityQuayTab";
import BoardingPositionsTab from "./BoardingPositionsTab";
import FacilitiesQuayTab from "./FacilitiesQuayTab";

class EditQuayAdditional extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
    };
  }

  handleTabOnChange = (event, value) => {
    this.setState({
      activeTabIndex: value,
    });
  };

  render() {
    const { intl, quay, index, disabled } = this.props;
    const { formatMessage } = intl;

    const style = {
      background: "#fff",
      overflowX: "hidden",
    };

    const tabStyle = {
      color: "#000",
      fontSize: "0.7em",
      fontWeight: 600,
      marginTop: -10,
    };

    const { activeTabIndex } = this.state;

    return (
      <div style={style} id="additional">
        <Tabs
          onChange={this.handleTabOnChange.bind(this)}
          value={activeTabIndex}
          tabItemContainerStyle={{ backgroundColor: "#fff", marginTop: -5 }}
        >
          <Tab
            style={tabStyle}
            label={formatMessage({ id: "accessibility" })}
            value={0}
          ></Tab>
          <Tab
            style={tabStyle}
            label={formatMessage({ id: "facilities" })}
            value={1}
          ></Tab>
          <Tab
            style={tabStyle}
            label={intl.formatMessage({ id: "boarding_positions_tab_label" })}
            value={2}
          ></Tab>
        </Tabs>
        {activeTabIndex === 0 && (
          <AccessibilityQuayTab
            intl={intl}
            quay={quay}
            index={index}
            disabled={disabled}
          />
        )}
        {activeTabIndex === 1 && (
          <FacilitiesQuayTab
            intl={intl}
            quay={quay}
            index={index}
            disabled={disabled}
          />
        )}
        {activeTabIndex === 2 && (
          <BoardingPositionsTab
            quay={quay}
            index={index}
            disabled={disabled}
            focusedElement={this.props.focusedBoardingPositionElement}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  focusedElement: state.mapUtils.focusedElement,
  focusedBoardingPositionElement: state.mapUtils.focusedBoardingPositionElement,
  stopPlace: state.stopPlace.current,
  activeTabIndex: state.user.activeQuayAdditionalTab,
});

export default injectIntl(connect(mapStateToProps)(EditQuayAdditional));
