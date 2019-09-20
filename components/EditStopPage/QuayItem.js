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
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import {
  StopPlaceActions,
  AssessmentActions,
  EquipmentActions,
} from '../../actions/';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';

import TicketMachine from '../../static/icons/facilities/TicketMachine';
import BusShelter from '../../static/icons/facilities/BusShelter';
import { injectIntl } from 'react-intl';
import FlatButton from 'material-ui/FlatButton';
import ImportedId from './ImportedId';
import MdLess from 'material-ui/svg-icons/navigation/expand-less';
import EditQuayAdditional from './EditQuayAdditional';
import WheelChairPopover from './WheelChairPopover';
import StepFreePopover from './StepFreePopover';
import { getIn } from '../../utils/';
import equipmentHelpers from '../../modelUtils/equipmentHelpers';
import Sign512 from '../../static/icons/TransportSign';

import ToolTippable from './ToolTippable';
import accessibilityAssessments from '../../models/accessibilityAssessments';
import MdDelete from 'material-ui/svg-icons/action/delete-forever';
import MdKey from 'material-ui/svg-icons/communication/vpn-key';
import { getPrimaryDarkerColor } from '../../config/themeConfig';
import Code from './Code';
import ItemHeader from './ItemHeader';
import Item from './Item';


class QuayItem extends React.Component {
  static propTypes = {
    publicCode: PropTypes.string.isRequired,
    quay: PropTypes.object.isRequired,
    handleRemoveQuay: PropTypes.func.isRequired,
    handleLocateOnMap: PropTypes.func.isRequired,
    handleToggleCollapse: PropTypes.func.isRequired,
    expanded: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      additionalExpanded: false,
      coordinatesDialogOpen: false,
    };
  }

  handleDescriptionChange = event => {
    const { dispatch, index } = this.props;
    dispatch(
      StopPlaceActions.changeElementDescription(
        index,
        event.target.value,
        'quay',
      ),
    );
  };

  handlePublicCodeChange = event => {
    const { dispatch, index } = this.props;
    dispatch(
      StopPlaceActions.changePublicCodeName(index, event.target.value, 'quay'),
    );
  };

  handlePrivateCodeChange = event => {
    const { dispatch, index } = this.props;
    dispatch(
      StopPlaceActions.changePrivateCodeName(index, event.target.value, 'quay'),
    );
  };

  showMoreOptionsForQuay = expanded => {
    this.setState({ additionalExpanded: expanded });
  };

  handleWheelChairChange(value) {
    const { index, dispatch } = this.props;
    dispatch(AssessmentActions.setQuayWheelchairAccess(value, index));
  }

  handleStepFreeChange(value) {
    const { index, dispatch } = this.props;
    dispatch(AssessmentActions.setQuayStepFreeAccess(value, index));
  }

  handleTicketMachineChange(value) {
    const { dispatch, disabled, index } = this.props;
    if (!disabled) {
      dispatch(EquipmentActions.updateTicketMachineState(value, 'quay', index));
    }
  }

  handleBusShelterChange(value) {
    const { dispatch, disabled, index } = this.props;
    if (!disabled) {
      dispatch(
        EquipmentActions.updateShelterEquipmentState(value, 'quay', index),
      );
    }
  }

  handleTransportSignChange(value) {
    const { dispatch, disabled, index } = this.props;
    if (!disabled) {
      dispatch(EquipmentActions.update512SignState(value, 'quay', index));
    }
  }

  handleChangeCoordinates(position) {
    const { dispatch, index, handleLocateOnMap } = this.props;
    dispatch(StopPlaceActions.changeElementPosition(index, 'quay', position));
    handleLocateOnMap(position);
  }

  render() {
    const {
      quay,
      publicCode,
      expanded,
      index,
      handleToggleCollapse,
      intl,
      stopPlaceType,
      disabled,
    } = this.props;
    const { formatMessage, locale } = intl;
    const { additionalExpanded, coordinatesDialogOpen } = this.state;

    const wheelchairAccess = getIn(
      quay,
      ['accessibilityAssessment', 'limitations', 'wheelchairAccess'],
      'UNKNOWN',
    );
    const stepFreeAccess = getIn(
      quay,
      ['accessibilityAssessment', 'limitations', 'stepFreeAccess'],
      'UNKNOWN',
    );
    const ticketMachine = equipmentHelpers.getTicketMachineState(quay);
    const busShelter = equipmentHelpers.getShelterEquipmentState(quay);
    const sign512 = equipmentHelpers.get512SignEquipment(quay);

    const wheelChairHint = formatMessage({ id: `accessibilityAssessments.wheelchairAccess.${wheelchairAccess.toLowerCase()}` });
    const ticketMachineHint = ticketMachine
      ? formatMessage({ id: 'ticketMachine' })
      : formatMessage({ id: 'ticketMachine_no' });
    const busShelterHint = busShelter
      ? formatMessage({ id: 'busShelter' })
      : formatMessage({ id: 'busShelter_no' });
    const transportSignHint = sign512
      ? formatMessage({ id: 'transport_sign' })
      : formatMessage({ id: 'transport_sign_no' });
    const stepFreeHint = formatMessage({ id: `accessibilityAssessments.stepFreeAccess.${stepFreeAccess.toLowerCase()}` });
    const quayItemName = stopPlaceType ? formatMessage({ id: `stopTypes.${stopPlaceType}.quayItemName` }) : null;

    const translations = {
      name: formatMessage({ id: 'name' }),
      publicCode: formatMessage({ id: 'publicCode' }),
      description: formatMessage({ id: 'description' }),
      unsaved: formatMessage({ id: 'unsaved' }),
      undefined: formatMessage({ id: 'undefined' }),
      none: formatMessage({ id: 'none_no' }),
      quays: formatMessage({ id: 'quays' }),
      pathJunctions: formatMessage({ id: 'pathJunctions' }),
      entrances: formatMessage({ id: 'entrances' }),
      stepFreeAccess: formatMessage({ id: 'step_free_access' }),
      noStepFreeAccess: formatMessage({ id: 'step_free_access_no' }),
      wheelchairAccess: formatMessage({ id: 'wheelchairAccess' }),
      noWheelchairAccess: formatMessage({ id: 'wheelchairAccess_no' }),
      ticketMachine: formatMessage({ id: 'ticketMachine' }),
      noTicketMachine: formatMessage({ id: 'ticketMachine_no' }),
      busShelter: formatMessage({ id: 'busShelter' }),
      noBusShelter: formatMessage({ id: 'busShelter_no' }),
      quayItemName: formatMessage({ id: quayItemName || 'name' }),
      quayMissingLocation: formatMessage({ id: 'quay_is_missing_location' }),
      localReference: formatMessage({ id: 'local_reference' }),
      privateCode: formatMessage({ id: 'privateCode' }),
      notAssigned: formatMessage({ id: 'not_assigned'})
    };

    const iconButtonStyle = {
      textAlign: 'right',
      width: '100%',
      paddingBottom: 0,
      display: 'flex',
      justifyContent: 'flex-end'
    };


    const quayTitlePrefix = `${translations.quayItemName
      ? translations.quayItemName
      : ''} `;
    const idTitle = `${quay.id || '?'}`;

    return (
      <Item
        handleChangeCoordinates={this.handleChangeCoordinates}>
        <ItemHeader
          translations={translations}
          location={location}
          expanded={expanded}
          handleLocateOnMap={() => handleLocateOnMap(quay.location, index, 'quay')}
          handleToggleCollapse={() => handleToggleCollapse(index, 'quay')}
          handleMissingCoordinatesClick={() => this.setState({ coordinatesDialogOpen: true })}>
            <span style={{ color: '#2196F3' }}>
              {quayTitlePrefix}
            </span>
            <Code type="publicCode" value={quay.publicCode} defaultValue={translations.notAssigned} />
            <Code type="privateCode" value={quay.privateCode} defaultValue={translations.notAssigned}/>
            <span
              style={{
                fontSize: '0.8em',
                marginLeft: 5,
                fontWeight: 600,
                color: '#464545',
              }}
            >
              {idTitle}
            </span>
        </ItemHeader>
        {!expanded
          ? null
          : <div className="quay-item-expanded">
              <ImportedId
                text={translations.localReference}
                id={quay.importedId}
              />
              <TextField
                hintText={translations.publicCode}
                floatingLabelText={translations.publicCode}
                disabled={disabled}
                defaultValue={quay.publicCode}
                style={{ width: '95%', marginTop: -10 }}
                onChange={e =>
                  typeof e.target.value === 'string' &&
                  this.handlePublicCodeChange(e)}
              />
              <TextField
                hintText={translations.privateCode}
                floatingLabelText={translations.privateCode}
                disabled={disabled}
                defaultValue={quay.privateCode}
                style={{ width: '95%', marginTop: -10 }}
                onChange={e =>
                  typeof e.target.value === 'string' &&
                  this.handlePrivateCodeChange(e)}
              />
              <TextField
                hintText={translations.description}
                disabled={disabled}
                floatingLabelText={translations.description}
                defaultValue={quay.description}
                style={{ width: '95%', marginTop: -10 }}
                onChange={e =>
                  typeof e.target.value === 'string' &&
                  this.handleDescriptionChange(e)}
              />
              {!additionalExpanded
                ? <div
                    style={{
                      marginTop: 10,
                      marginBottom: 5,
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}
                  >
                    <ToolTippable toolTipText={wheelChairHint}>
                      <WheelChairPopover
                        disabled={disabled}
                        intl={intl}
                        wheelchairAccess={wheelchairAccess}
                        handleChange={this.handleWheelChairChange.bind(this)}
                      />
                    </ToolTippable>
                    <ToolTippable toolTipText={stepFreeHint}>
                      <StepFreePopover
                        intl={intl}
                        disabled={disabled}
                        stepFreeAccess={stepFreeAccess}
                        handleChange={this.handleStepFreeChange.bind(this)}
                      />
                    </ToolTippable>
                    <ToolTippable toolTipText={ticketMachineHint}>
                      <Checkbox
                        checkedIcon={<TicketMachine />}
                        disabled={disabled}
                        uncheckedIcon={
                          <TicketMachine
                            style={{ fill: '#8c8c8c', opacity: '0.8' }}
                          />
                        }
                        style={{ width: 'auto' }}
                        checked={ticketMachine}
                        onCheck={(e, v) => {
                          this.handleTicketMachineChange(v);
                        }}
                      />
                    </ToolTippable>
                    <ToolTippable toolTipText={busShelterHint}>
                      <Checkbox
                        checkedIcon={<BusShelter />}
                        disabled={disabled}
                        uncheckedIcon={
                          <BusShelter
                            style={{ fill: '#8c8c8c', opacity: '0.8' }}
                          />
                        }
                        style={{ width: 'auto' }}
                        checked={busShelter}
                        onCheck={(e, v) => {
                          this.handleBusShelterChange(v);
                        }}
                      />
                    </ToolTippable>
                    <ToolTippable toolTipText={transportSignHint}>
                      <Checkbox
                        checkedIcon={
                          <Sign512
                            style={{
                              transform:
                                'scale(1) translateY(-12px) translateX(-12px)',
                            }}
                          />
                        }
                        disabled={disabled}
                        uncheckedIcon={
                          <Sign512
                            style={{
                              transform:
                                'scale(1) translateY(-12px) translateX(-12px)',
                              fill: '#8c8c8c',
                              opacity: '0.8',
                            }}
                          />
                        }
                        style={{ width: 'auto' }}
                        checked={sign512}
                        onCheck={(e, v) => {
                          this.handleTransportSignChange(v);
                        }}
                      />
                    </ToolTippable>
                  </div>
                : null}
              <div style={{ textAlign: 'center', width: '100%' }}>
                {additionalExpanded
                  ? <FlatButton
                      icon={<MdLess />}
                      onClick={() => this.showMoreOptionsForQuay(false)}
                    />
                  : <FlatButton
                    style={{marginTop: 5, marginBottom: -5}}
                    label={formatMessage({ id: 'more' })}
                      onClick={() => this.showMoreOptionsForQuay(true)}
                    />}
                {additionalExpanded
                  ? <EditQuayAdditional
                      quay={quay}
                      index={index}
                      disabled={disabled}
                    />
                  : null}
              </div>
              <div style={iconButtonStyle}>
                <ToolTippable toolTipText={formatMessage({id: 'key_values_hint'})}>
                  <IconButton
                    onClick={this.props.handleOpenKeyValuesDialog}
                  >
                    <MdKey color={quay.keyValues.length ? getPrimaryDarkerColor() : '#000'}/>
                  </IconButton>
                </ToolTippable>
                <ToolTippable toolTipText={formatMessage({id: 'delete_quay'})} toolTipStyle={{marginLeft: 10}}>
                  <IconButton
                    disabled={disabled}
                    onClick={this.props.handleRemoveQuay}
                  >
                    <MdDelete/>
                  </IconButton>
                </ToolTippable>
              </div>
            </div>}
      </Item>
    );
  }
}

export default injectIntl(connect(null)(QuayItem));
