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
import ToolTipIcon from './ToolTipIcon';
import Divider from 'material-ui/Divider';
import WheelChairPopover from './WheelChairPopover';
import StepFreePopover from './StepFreePopover';
import { connect } from 'react-redux';
import { getIn } from '../../utils';
import { AssessmentActions } from '../../actions/';

class AcessibilityStopTab extends React.Component {
  handleWheelChairChange(value) {
    this.props.dispatch(AssessmentActions.setStopWheelchairAccess(value));
  }

  handleStepFreeChange(value) {
    this.props.dispatch(AssessmentActions.setStopStepFreeAccess(value));
  }

  render() {
    const { stopPlace, intl, disabled } = this.props;
    const { formatMessage } = intl;

    const wheelchairAccess = getIn(
      stopPlace,
      ['accessibilityAssessment', 'limitations', 'wheelchairAccess'],
      'UNKNOWN',
    );
    const stepFreeAccess = getIn(
      stopPlace,
      ['accessibilityAssessment', 'limitations', 'stepFreeAccess'],
      'UNKNOWN',
    );

    return (
      <div style={{ padding: 10 }}>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <WheelChairPopover
              disabled={disabled}
              displayLabel={true}
              intl={intl}
              wheelchairAccess={wheelchairAccess}
              handleChange={this.handleWheelChairChange.bind(this)}
            />
            <ToolTipIcon
              title={formatMessage({ id: 'wheelchair_stop_hint' })}
            />
          </div>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <StepFreePopover
              disabled={disabled}
              displayLabel={true}
              intl={intl}
              stepFreeAccess={stepFreeAccess}
              handleChange={this.handleStepFreeChange.bind(this)}
            />
            <ToolTipIcon
              title={formatMessage({ id: 'step_free_access_hint' })}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  stopPlace: state.stopPlace.current,
});

export default connect(mapStateToProps)(AcessibilityStopTab);
