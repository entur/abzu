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
import { getIn } from "../../../utils";
import ErsadItem from "../ErsadItem";
import AccessibilityLimitationPopover from "./AccessibilityLimitationPopover";

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

  handleVisualSignsChange(value) {
    this.props.dispatch(
      AssessmentActions.setStopVisualSignsAvailable(value, this.props.index),
    );
  }

  handleEscalatorFreeAccessChange(value) {
    this.props.dispatch(
      AssessmentActions.setStopEscalatorFreeAccess(value, this.props.index),
    );
  }

  handleLiftFreeAccessChange(value) {
    this.props.dispatch(
      AssessmentActions.setStopLiftFreeAccess(value, this.props.index),
    );
  }

  render() {
    const { stopPlace, disabled } = this.props;

    const accessibilityLimitationsKeys = [
      "accessibilityAssessment",
      "limitations",
    ];
    const wheelchairAccess = getIn(
      stopPlace,
      accessibilityLimitationsKeys.concat(
        AccessibilityLimitationEnum.WHEELCHAIR_ACCESS,
      ),
      AccessibilityLimitationType.UNKNOWN,
    );
    const stepFreeAccess = getIn(
      stopPlace,
      accessibilityLimitationsKeys.concat(
        AccessibilityLimitationEnum.STEP_FREE_ACCESS,
      ),
      AccessibilityLimitationType.UNKNOWN,
    );
    const audibleSignalsAvailable = getIn(
      stopPlace,
      accessibilityLimitationsKeys.concat(
        AccessibilityLimitationEnum.AUDIBLE_SIGNALS_AVAILABLE,
      ),
      AccessibilityLimitationType.UNKNOWN,
    );
    const visualSignsAvailable = getIn(
      stopPlace,
      accessibilityLimitationsKeys.concat(
        AccessibilityLimitationEnum.VISUAL_SIGNS_AVAILABLE,
      ),
      AccessibilityLimitationType.UNKNOWN,
    );
    const escalatorFreeAccess = getIn(
      stopPlace,
      accessibilityLimitationsKeys.concat(
        AccessibilityLimitationEnum.ESCALATOR_FREE_ACCESS,
      ),
      AccessibilityLimitationType.UNKNOWN,
    );
    const liftFreeAccess = getIn(
      stopPlace,
      accessibilityLimitationsKeys.concat(
        AccessibilityLimitationEnum.LIFT_FREE_ACCESS,
      ),
      AccessibilityLimitationType.UNKNOWN,
    );
    const entityType = "stopPlace";

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

const mapStateToProps = (state) => ({
  stopPlace: state.stopPlace.current,
});

export default connect(mapStateToProps)(AccessibilityStopTab);
