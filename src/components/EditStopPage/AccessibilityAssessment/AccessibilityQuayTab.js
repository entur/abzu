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
import ElevatorIcon from "@mui/icons-material/Elevator";
import EscalatorIcon from "@mui/icons-material/Escalator";
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
import ErsadItem from "../ErsadItem";
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

  handleEscalatorFreeAccessChange(value) {
    this.props.dispatch(
      AssessmentActions.setQuayEscalatorFreeAccess(value, this.props.index),
    );
  }

  handleLiftFreeAccessChange(value) {
    this.props.dispatch(
      AssessmentActions.setQuayLiftFreeAccess(value, this.props.index),
    );
  }

  render() {
    const { quay, disabled } = this.props;

    const accessibilityLimitationsKeys = [
      "accessibilityAssessment",
      "limitations",
    ];
    const wheelchairAccess = getIn(
      quay,
      accessibilityLimitationsKeys.concat(
        AccessibilityLimitationEnum.WHEELCHAIR_ACCESS,
      ),
      AccessibilityLimitationType.UNKNOWN,
    );
    const stepFreeAccess = getIn(
      quay,
      accessibilityLimitationsKeys.concat(
        AccessibilityLimitationEnum.STEP_FREE_ACCESS,
      ),
      AccessibilityLimitationType.UNKNOWN,
    );
    const audibleSignalsAvailable = getIn(
      quay,
      accessibilityLimitationsKeys.concat(
        AccessibilityLimitationEnum.AUDIBLE_SIGNALS_AVAILABLE,
      ),
      AccessibilityLimitationType.UNKNOWN,
    );
    const visualSignsAvailable = getIn(
      quay,
      accessibilityLimitationsKeys.concat(
        AccessibilityLimitationEnum.VISUAL_SIGNS_AVAILABLE,
      ),
      AccessibilityLimitationType.UNKNOWN,
    );
    const escalatorFreeAccess = getIn(
      quay,
      accessibilityLimitationsKeys.concat(
        AccessibilityLimitationEnum.ESCALATOR_FREE_ACCESS,
      ),
      AccessibilityLimitationType.UNKNOWN,
    );
    const liftFreeAccess = getIn(
      quay,
      accessibilityLimitationsKeys.concat(
        AccessibilityLimitationEnum.LIFT_FREE_ACCESS,
      ),
      AccessibilityLimitationType.UNKNOWN,
    );
    const entityType = "quay";

    return (
      <div style={{ padding: 10 }}>
        <ErsadItem
          name={AccessibilityLimitationEnum.WHEELCHAIR_ACCESS}
          entityType={entityType}
          item={
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
          }
        />
        <ErsadItem
          name={AccessibilityLimitationEnum.STEP_FREE_ACCESS}
          entityType={entityType}
          item={
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
          }
        />
        <ErsadItem
          name={AccessibilityLimitationEnum.AUDIBLE_SIGNALS_AVAILABLE}
          entityType={entityType}
          item={
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
          }
        />
        <ErsadItem
          name={AccessibilityLimitationEnum.VISUAL_SIGNS_AVAILABLE}
          entityType={entityType}
          item={
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
          }
        />
        <ErsadItem
          name={AccessibilityLimitationEnum.ESCALATOR_FREE_ACCESS}
          entityType={entityType}
          item={
            <AccessibilityLimitationPopover
              disabled={disabled}
              displayLabel={true}
              accessibilityLimitationState={escalatorFreeAccess}
              handleChange={this.handleEscalatorFreeAccessChange.bind(this)}
              accessibilityLimitationName={
                AccessibilityLimitationEnum.ESCALATOR_FREE_ACCESS
              }
              icon={<EscalatorIcon />}
            />
          }
        />
        <ErsadItem
          name={AccessibilityLimitationEnum.LIFT_FREE_ACCESS}
          entityType={entityType}
          item={
            <AccessibilityLimitationPopover
              disabled={disabled}
              displayLabel={true}
              accessibilityLimitationState={liftFreeAccess}
              handleChange={this.handleLiftFreeAccessChange.bind(this)}
              accessibilityLimitationName={
                AccessibilityLimitationEnum.LIFT_FREE_ACCESS
              }
              icon={<ElevatorIcon />}
            />
          }
        />
      </div>
    );
  }
}

export default connect(null)(AccessibilityQuayTab);
