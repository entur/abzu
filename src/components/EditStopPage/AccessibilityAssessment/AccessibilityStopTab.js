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

import React from "react";
import { connect } from "react-redux";
import { AssessmentActions } from "../../../actions/";
import { AccessibilityLimitationState } from "../../../models/accessibilityAssessments";
import { getIn } from "../../../utils";
import AccessibilityLimitation from "./AccessibilityLimitation";
import AudibleSignalsPopover from "./AudibleSignalsPopover";
import StepFreePopover from "./StepFreePopover";
import WheelChairPopover from "./WheelChairPopover";

class AccessibilityStopTab extends React.Component {
  handleWheelChairChange(value) {
    this.props.dispatch(AssessmentActions.setStopWheelchairAccess(value));
  }

  handleStepFreeChange(value) {
    this.props.dispatch(AssessmentActions.setStopStepFreeAccess(value));
  }

  handleAudibleSignalsChange(value) {
    this.props.dispatch(
      AssessmentActions.setStopAudibleSignalsAvailable(value, this.props.index),
    );
  }

  render() {
    const { stopPlace, intl, disabled } = this.props;
    const { formatMessage } = intl;

    const wheelchairAccess = getIn(
      stopPlace,
      ["accessibilityAssessment", "limitations", "wheelchairAccess"],
      AccessibilityLimitationState.UNKNOWN,
    );
    const stepFreeAccess = getIn(
      stopPlace,
      ["accessibilityAssessment", "limitations", "stepFreeAccess"],
      AccessibilityLimitationState.UNKNOWN,
    );
    const audibleSignalsAvailable = getIn(
      stopPlace,
      ["accessibilityAssessment", "limitations", "audibleSignalsAvailable"],
      AccessibilityLimitationState.UNKNOWN,
    );

    return (
      <div style={{ padding: 10 }}>
        <AccessibilityLimitation tooltipTitle={"wheelchair_stop_hint"}>
          <WheelChairPopover
            disabled={disabled}
            displayLabel={true}
            intl={intl}
            wheelchairAccess={wheelchairAccess}
            handleChange={this.handleWheelChairChange.bind(this)}
          />
        </AccessibilityLimitation>
        <AccessibilityLimitation tooltipTitle={"step_free_access_hint"}>
          <StepFreePopover
            disabled={disabled}
            displayLabel={true}
            intl={intl}
            stepFreeAccess={stepFreeAccess}
            handleChange={this.handleStepFreeChange.bind(this)}
          />
        </AccessibilityLimitation>
        <AccessibilityLimitation tooltipTitle={"audibleSignals_stop_hint"}>
          <AudibleSignalsPopover
            disabled={disabled}
            displayLabel={true}
            audibleSignalsState={audibleSignalsAvailable}
            handleChange={this.handleAudibleSignalsChange.bind(this)}
          />
        </AccessibilityLimitation>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  stopPlace: state.stopPlace.current,
});

export default connect(mapStateToProps)(AccessibilityStopTab);
