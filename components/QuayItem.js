import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import {
  StopPlaceActions,
  AssessmentActions,
  EquipmentActions,
} from '../actions/';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location';
import TicketMachine from '../static/icons/facilities/TicketMachine';
import BusShelter from '../static/icons/facilities/BusShelter';
import { injectIntl } from 'react-intl';
import FlatButton from 'material-ui/FlatButton';
import stopTypes from '../models/stopTypes';
import Divider from 'material-ui/Divider';
import MdError from 'material-ui/svg-icons/alert/error';
import ImportedId from './ImportedId';
import MdLess from 'material-ui/svg-icons/navigation/expand-less';
import EditQuayAdditional from '../containers/EditQuayAdditional';
import WheelChairPopover from './WheelChairPopover';
import StepFreePopover from './StepFreePopover';
import { getIn } from '../utils/';
import equipmentHelpers from '../modelUtils/equipmentHelpers';
import Sign512 from '../static/icons/TransportSign';
import CoordinatesDialog from './CoordinatesDialog';
import ToolTippable from './ToolTippable';
import accessibilityAssessments from '../models/accessibilityAssessments';
import MdDelete from 'material-ui/svg-icons/action/delete-forever';
import MdKey from 'material-ui/svg-icons/communication/vpn-key';
import { enturPrimaryDarker } from '../config/enturTheme';

class QuayItem extends React.Component {
  static PropTypes = {
    publicCode: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
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
    this.setState({
      coordinatesDialogOpen: false,
    });
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

    const wheelChairHint =
      accessibilityAssessments.wheelchairAccess.values[locale][
        wheelchairAccess
      ];
    const ticketMachineHint = ticketMachine
      ? formatMessage({ id: 'ticketMachine' })
      : formatMessage({ id: 'ticketMachine_no' });
    const busShelterHint = busShelter
      ? formatMessage({ id: 'busShelter' })
      : formatMessage({ id: 'busShelter_no' });
    const transportSignHint = sign512
      ? formatMessage({ id: 'transport_sign' })
      : formatMessage({ id: 'transport_sign_no' });
    const stepFreeHint =
      accessibilityAssessments.stepFreeAccess.values[locale][stepFreeAccess];

    let quayItemName = null;

    stopTypes[locale].forEach(stopType => {
      if (stopType.value === stopPlaceType) {
        quayItemName = stopType.quayItemName;
      }
    });

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
    };

    const iconButtonStyle = {
      textAlign: 'right',
      width: '100%',
      paddingBottom: 0,
    };

    const locationStyle = {
      marginRight: 5,
      height: 16,
      width: 16,
    };

    const quayTitlePrefix = `${translations.quayItemName
      ? translations.quayItemName
      : ''} `;
    const quayTitleSuffix = `${publicCode || ''}`;
    const idTitle = `${quay.id || '?'}`;

    return (
      <div>
        <div className="tabItem">
          <div
            style={{
              float: 'flex',
              alignItems: 'center',
              width: '95%',
              marginTop: 10,
              padding: 5,
            }}
          >
            {quay.location
              ? <MapsMyLocation
                  style={locationStyle}
                  onClick={() => this.props.handleLocateOnMap(quay.location, index, 'quay')}
                />
              : <div
                  className="tooltip"
                  style={{ display: 'inline-block' }}
                  title={translations.quayMissingLocation}
                >
                  <span className="tooltipText"> </span>
                  <MdError
                    style={{ ...locationStyle, color: '#bb271c' }}
                    onClick={() => {
                      this.setState({ coordinatesDialogOpen: true });
                    }}
                  />
                </div>}
            <div
              style={{ display: 'inline-block', verticalAlign: 'middle' }}
              onClick={() => handleToggleCollapse(index, 'quay')}
            >
              <span style={{ color: '#2196F3' }}>
                {quayTitlePrefix + quayTitleSuffix}
              </span>
              <span
                style={{
                  fontSize: '0.8em',
                  marginLeft: 5,
                  fontWeight: 600,
                  color: '#464545',
                }}
              >
                {' '}{idTitle}
                {' '}
              </span>
            </div>
            {!expanded
              ? <NavigationExpandMore
                  onClick={() => handleToggleCollapse(index, 'quay')}
                  style={{ float: 'right' }}
                />
              : <NavigationExpandLess
                  onClick={() => handleToggleCollapse(index, 'quay')}
                  style={{ float: 'right' }}
                />}
          </div>
        </div>
        {!expanded
          ? null
          : <div>
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
                <IconButton
                  disabled={disabled}
                  onClick={this.props.handleOpenKeyValuesDialog}
                >
                  <MdKey color={quay.keyValues.length ? enturPrimaryDarker : '#000'}/>
                </IconButton>
                <IconButton
                  disabled={disabled}
                  onClick={this.props.handleRemoveQuay}
                >
                  <MdDelete/>
                </IconButton>
              </div>
            </div>}
        <Divider inset={true} style={{ marginTop: 2 }} />
        <CoordinatesDialog
          open={coordinatesDialogOpen}
          intl={intl}
          handleConfirm={this.handleChangeCoordinates.bind(this)}
          handleClose={() => {
            this.setState({ coordinatesDialogOpen: false });
          }}
        />
      </div>
    );
  }
}

export default injectIntl(connect(null)(QuayItem));
