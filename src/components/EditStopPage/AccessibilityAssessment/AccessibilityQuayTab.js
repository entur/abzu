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

import WheelChair from "@mui/icons-material/Accessible";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import React from "react";
import { connect } from "react-redux";
import { AssessmentActions } from "../../../actions/";
import {
  AccessibilityLimitation as AccessibilityLimitationEnum,
  AccessibilityLimitationType,
} from "../../../models/AccessibilityLimitation";
import StairsIcon from "../../../static/icons/accessibility/Stairs";
import { getIn } from "../../../utils/";
import AccessibilityLimitation from "./AccessibilityLimitation";
import AccessibilityLimitationPopover from "./AccessibilityLimitationPopover";

class AccessibilityQuayTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepFreeAccess: false,
    };
  }

  handleWheelChairChange(value) {
    this.props.dispatch(
      AssessmentActions.setQuayWheelchairAccess(value, this.props.index),
    );
  }

  handleStepFreeChange(value) {
    this.props.dispatch(
      AssessmentActions.setQuayStepFreeAccess(value, this.props.index),
    );
  }

  handleAudibleSignalsChange(value) {
    this.props.dispatch(
      AssessmentActions.setQuayAudibleSignalsAvailable(value, this.props.index),
    );
  }

  handleVisualSignsChange(value) {
    this.props.dispatch(
      AssessmentActions.setQuayVisibleSignsAvailable(value, this.props.index),
    );
  }

  render() {
    const { quay, disabled } = this.props;

    const wheelchairAccess = getIn(
      quay,
      ["accessibilityAssessment", "limitations", "wheelchairAccess"],
      AccessibilityLimitationType.UNKNOWN,
    );
    const stepFreeAccess = getIn(
      quay,
      ["accessibilityAssessment", "limitations", "stepFreeAccess"],
      AccessibilityLimitationType.UNKNOWN,
    );
    const audibleSignalsAvailable = getIn(
      quay,
      ["accessibilityAssessment", "limitations", "audibleSignalsAvailable"],
      AccessibilityLimitationType.UNKNOWN,
    );
    const visualSignsAvailable = getIn(
      quay,
      ["accessibilityAssessment", "limitations", "visualSignsAvailable"],
      AccessibilityLimitationType.UNKNOWN,
    );

    return (
      <div style={{ padding: 10 }}>
        <AccessibilityLimitation tooltipTitle={"wheelchair_quay_hint"}>
          <AccessibilityLimitationPopover
            disabled={disabled}
            displayLabel={true}
            accessibilityLimitationState={wheelchairAccess}
            handleChange={this.handleWheelChairChange.bind(this)}
            accessibilityLimitationName={
              AccessibilityLimitationEnum.WHEELCHAIR_ACCESS
            }
            icon={<WheelChair />}
          />
        </AccessibilityLimitation>
        <AccessibilityLimitation tooltipTitle={"step_free_access_quay_hint"}>
          <AccessibilityLimitationPopover
            disabled={disabled}
            displayLabel={true}
            accessibilityLimitationState={stepFreeAccess}
            handleChange={this.handleStepFreeChange.bind(this)}
            accessibilityLimitationName={
              AccessibilityLimitationEnum.STEP_FREE_ACCESS
            }
            icon={<StairsIcon />}
          />
        </AccessibilityLimitation>
        <AccessibilityLimitation
          tooltipTitle={"audibleSignalsAvailable_quay_hint"}
        >
          <AccessibilityLimitationPopover
            disabled={disabled}
            displayLabel={true}
            accessibilityLimitationState={audibleSignalsAvailable}
            handleChange={this.handleAudibleSignalsChange.bind(this)}
            accessibilityLimitationName={
              AccessibilityLimitationEnum.AUDIBLE_SIGNALS_AVAILABLE
            }
            icon={<VolumeUpIcon />}
          />
        </AccessibilityLimitation>
        <AccessibilityLimitation
          tooltipTitle={"visualSignsAvailable_quay_hint"}
        >
          <AccessibilityLimitationPopover
            disabled={disabled}
            displayLabel={true}
            accessibilityLimitationState={visualSignsAvailable}
            handleChange={this.handleVisualSignsChange.bind(this)}
            accessibilityLimitationName={
              AccessibilityLimitationEnum.VISUAL_SIGNS_AVAILABLE
            }
            icon={<FollowTheSignsIcon />}
          />
        </AccessibilityLimitation>
      </div>
    );
  }
}

export default connect(null)(AccessibilityQuayTab);
