import React from 'react';
import ModalityIcon from '../components/ModalityIcon';
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import ImportedId from '../components/ImportedId';
import {
  StopPlaceActions,
  AssessmentActions,
  EquipmentActions,
} from '../actions/';
import { connect } from 'react-redux';
import TicketMachine from '../static/icons/facilities/TicketMachine';
import BusShelter from '../static/icons/facilities/BusShelter';
import debounce from 'lodash.debounce';
import Checkbox from 'material-ui/Checkbox';
import stopTypes, { unknownStopPlaceType } from '../models/stopTypes';
import MdWC from 'material-ui/svg-icons/notification/wc';
import WaitingRoom from '../static/icons/facilities/WaitingRoom';
import WheelChairPopover from './WheelChairPopover';
import { getIn } from '../utils';
import equipmentHelpers from '../modelUtils/equipmentHelpers';
import MdLanguage from 'material-ui/svg-icons/action/language';
import { enturPrimaryDarker } from '../config/enturTheme';
import AltNamesDialog from './AltNamesDialog';
import TariffZonesDialog from './TariffZonesDialog';
import MdTransfer from 'material-ui/svg-icons/maps/transfer-within-a-station';
import WeightingPopover from './WeightingPopover';
import weightTypes, { weightColors, noValue } from '../models/weightTypes';
import Sign512 from '../static/icons/TransportSign';
import { hasExpired } from '../modelUtils/validBetweens';
import MdWarning from 'material-ui/svg-icons/alert/warning';
import ToolTippable from './ToolTippable';
import accessibilityAssessments from '../models/accessibilityAssessments';

class StopPlaceDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stopTypeOpen: false,
      weightingOpen: false,
      name: props.stopPlace.name || '',
      description: props.stopPlace.description || '',
      altNamesDialogOpen: false,
      tariffZoneOpen: false,
    };

    this.updateStopName = debounce(value => {
      this.props.dispatch(StopPlaceActions.changeStopName(value));
    }, 200);

    this.updateStopDescription = debounce(value => {
      this.props.dispatch(StopPlaceActions.changeStopDescription(value));
    }, 200);
  }

  componentWillReceiveProps(props) {
    this.setState({
      description: props.stopPlace.description || '',
      name: props.stopPlace.name || '',
    });
  }

  handleCloseStopPlaceTypePopover() {
    this.setState({
      stopTypeOpen: false,
    });
  }

  handleOpenStopPlaceTypePopover(event) {
    if (!this.props.disabled) {
      this.setState({
        stopTypeOpen: true,
        wheelChairOpen: false,
        stopTypeAnchorEl: event.currentTarget,
        altNamesDialogOpen: false,
        weightingOpen: false,
      });
    }
  }

  getWeightingStateColor(stopPlace) {
    const weightingValue = stopPlace.weighting;
    return weightColors[weightingValue] || 'grey';
  }

  getNameForWeightingState(stopPlace, locale) {
    const weightingValue = stopPlace.weighting;
    const types = weightTypes[locale];

    for (let i = 0; i < types.length; i++) {
      if (types[i].value === weightingValue) {
        return types[i].name;
      }
    }
    return noValue[locale];
  }

  handleOpenWeightPopover(event) {
    this.setState({
      weightingOpen: true,
      weightingAnchorEl: event.currentTarget,
      wheelChairOpen: false,
      stopTypeOpen: false,
      altNamesDialogOpen: false,
    });
  }

  handleStopNameChange(event) {
    const name = event.target.value;
    this.setState({
      name: name,
    });

    this.updateStopName(name);
  }

  handleStopDescriptionChange(event) {
    const description = event.target.value;
    this.setState({
      description: description,
    });

    this.updateStopDescription(description);
  }

  handleHandleWheelChair(value) {
    if (!this.props.disabled)
      this.props.dispatch(AssessmentActions.setStopWheelchairAccess(value));
  }

  handleStopTypeChange(value) {
    this.handleCloseStopPlaceTypePopover();
    this.props.dispatch(StopPlaceActions.changeStopType(value));
  }

  handleTicketMachineChange(value) {
    if (!this.props.disabled) {
      this.props.dispatch(
        EquipmentActions.updateTicketMachineState(
          value,
          'stopPlace',
          this.props.stopPlace.id,
        ),
      );
    }
  }

  handleBusShelterChange(value) {
    if (!this.props.disabled) {
      this.props.dispatch(
        EquipmentActions.updateShelterEquipmentState(
          value,
          'stopPlace',
          this.props.stopPlace.id,
        ),
      );
    }
  }

  handleWCChange(value) {
    if (!this.props.disabled) {
      this.props.dispatch(
        EquipmentActions.updateSanitaryState(
          value,
          'stopPlace',
          this.props.stopPlace.id,
        ),
      );
    }
  }

  handleWaitingRoomChange(value) {
    if (!this.props.disabled) {
      this.props.dispatch(
        EquipmentActions.updateWaitingRoomState(
          value,
          'stopPlace',
          this.props.stopPlace.id,
        ),
      );
    }
  }

  handleWeightChange(value) {
    const { dispatch } = this.props;
    dispatch(StopPlaceActions.changeWeightingForStop(value));
    this.setState({
      weightingOpen: false,
    });
  }

  handleChangeSign512(value) {
    if (!this.props.disabled) {
      this.props.dispatch(
        EquipmentActions.update512SignState(
          value,
          'stopPlace',
          this.props.stopPlace.id,
        ),
      );
    }
  }

  getStopTypeTranslation(locale, stopPlaceType) {
    let translations = stopTypes[locale].filter(
      type => type.value === stopPlaceType,
    );
    if (translations && translations.length) return translations[0].name;

    return unknownStopPlaceType[locale];
  }

  render() {
    const fixedHeader = {
      position: 'relative',
      display: 'block',
    };

    const { stopPlace, intl, expanded, disabled } = this.props;
    const { formatMessage, locale } = intl;
    const {
      name,
      description,
      altNamesDialogOpen,
      weightingOpen,
      weightingAnchorEl,
      tariffZoneOpen,
    } = this.state;

    const wheelchairAccess = getIn(
      stopPlace,
      ['accessibilityAssessment', 'limitations', 'wheelchairAccess'],
      'UNKNOWN',
    );

    const ticketMachine = equipmentHelpers.getTicketMachineState(stopPlace);
    const busShelter = equipmentHelpers.getShelterEquipmentState(stopPlace);
    const waitingRoom = equipmentHelpers.getWaitingRoomState(stopPlace);
    const WC = equipmentHelpers.getSanitaryEquipmentState(stopPlace);
    const sign512 = equipmentHelpers.get512SignEquipment(stopPlace);

    const hasAltNames = !!(
      stopPlace.alternativeNames && stopPlace.alternativeNames.length
    );

    const stopTypeHint = this.getStopTypeTranslation(
      locale,
      stopPlace.stopPlaceType,
    );
    const weightingStateHint = this.getNameForWeightingState(stopPlace, locale);
    const expirationText = formatMessage({ id: 'stop_has_expired' });
    const versionLabel = formatMessage({ id: 'version' });
    const stopIsInvalid = hasExpired(stopPlace.validBetweens);

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
    const WCHint = WC
      ? formatMessage({ id: 'wc' })
      : formatMessage({ id: 'wc_no' });
    const waitingRoomHint = waitingRoom
      ? formatMessage({ id: 'waiting_room' })
      : formatMessage({ id: 'waiting_room_no' });
    const transportSignHint = sign512
      ? formatMessage({ id: 'transport_sign' })
      : formatMessage({ id: 'transport_sign_no' });
    const tariffZonesHint = formatMessage({ id: 'tariffZones' });
    const altNamesHint = formatMessage({ id: 'alternative_names' });

    return (
      <div style={fixedHeader}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            {!stopPlace.isNewStop &&
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>
                  {versionLabel} {stopPlace.version}
                </span>
                {!stopIsInvalid &&
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <MdWarning
                      color="orange"
                      style={{ marginTop: -5, marginLeft: 10 }}
                    />
                    <span style={{ color: '#bb271c', marginLeft: 5 }}>
                      {' '}{expirationText}
                    </span>
                  </div>}
              </div>}
            <ImportedId
              id={stopPlace.importedId}
              text={formatMessage({ id: 'local_reference' })}
            />
          </div>
          <ToolTippable toolTipText={stopTypeHint}>
            <IconButton
              style={{ borderBottom: disabled ? 'none' : '1px dotted grey' }}
              onClick={e => {
                this.handleOpenStopPlaceTypePopover(e);
              }}
            >
              <ModalityIcon type={stopPlace.stopPlaceType} />
            </IconButton>
          </ToolTippable>
          <Popover
            open={this.state.stopTypeOpen}
            anchorEl={this.state.stopTypeAnchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            onRequestClose={this.handleCloseStopPlaceTypePopover.bind(this)}
            animation={PopoverAnimationVertical}
            style={{ overflowY: 'none' }}
            animated={true}
          >
            {stopTypes[locale].map((type, index) =>
              <MenuItem
                key={'stopType' + index}
                value={type.value}
                style={{ padding: '0px 10px' }}
                primaryText={type.name}
                onClick={() => {
                  this.handleStopTypeChange(type.value);
                }}
                insetChildren={true}
                leftIcon={
                  <ModalityIcon
                    iconStyle={{ float: 'left' }}
                    type={type.value}
                  />
                }
              />,
            )}
          </Popover>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            hintText={formatMessage({ id: 'name' })}
            floatingLabelText={formatMessage({ id: 'name' })}
            style={{ marginTop: -10, width: 300 }}
            value={name}
            disabled={disabled}
            onChange={this.handleStopNameChange.bind(this)}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ToolTippable toolTipText={tariffZonesHint}>
              <div
                onClick={() => {
                  this.setState({
                    tariffZoneOpen: true,
                    altNamesDialogOpen: false,
                    weightingOpen: false,
                  });
                }}
                style={{
                  borderBottom: '1px dotted',
                  marginTop: 13,
                  paddingBottom: 4,
                  marginLeft: 8,
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    color: (stopPlace.tariffZones || []).length
                      ? enturPrimaryDarker
                      : '#000',
                  }}
                >
                  Tz
                </span>
              </div>
            </ToolTippable>
            <div
              style={{
                borderBottom: '1px dotted',
                marginLeft: 8,
                marginTop: -3,
              }}
            >
              <ToolTippable toolTipText={altNamesHint}>
                <IconButton
                  onClick={() => {
                    this.setState({
                      altNamesDialogOpen: true,
                      weightingOpen: false,
                      tariffZoneOpen: false,
                    });
                  }}
                >
                  <MdLanguage
                    color={hasAltNames ? enturPrimaryDarker : '#000'}
                  />
                </IconButton>
              </ToolTippable>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            hintText={formatMessage({ id: 'description' })}
            floatingLabelText={formatMessage({ id: 'description' })}
            style={{ width: 340, marginTop: -10 }}
            disabled={disabled}
            value={description}
            onChange={this.handleStopDescriptionChange.bind(this)}
          />
          <ToolTippable
            toolTipText={weightingStateHint}
            style={{ marginLeft: 6, borderBottom: '1px dotted', marginTop: -3 }}
          >
            <IconButton
              onClick={e => {
                this.handleOpenWeightPopover(e);
              }}
            >
              <MdTransfer color={this.getWeightingStateColor(stopPlace)} />
            </IconButton>
            <WeightingPopover
              open={!disabled && weightingOpen}
              anchorEl={weightingAnchorEl}
              handleChange={v => this.handleWeightChange(v)}
              locale={locale}
              handleClose={() => {
                this.setState({ weightingOpen: false });
              }}
            />
          </ToolTippable>
        </div>
        {expanded
          ? null
          : <div
              style={{
                marginTop: 10,
                marginBottom: 10,
                height: 15,
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <ToolTippable toolTipText={wheelChairHint}>
                <WheelChairPopover
                  intl={intl}
                  handleChange={this.handleHandleWheelChair.bind(this)}
                  wheelchairAccess={wheelchairAccess}
                />
              </ToolTippable>
              <ToolTippable toolTipText={ticketMachineHint}>
                <Checkbox
                  checkedIcon={<TicketMachine />}
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
                  uncheckedIcon={
                    <BusShelter style={{ fill: '#8c8c8c', opacity: '0.8' }} />
                  }
                  style={{ width: 'auto' }}
                  checked={busShelter}
                  onCheck={(e, v) => {
                    this.handleBusShelterChange(v);
                  }}
                />
              </ToolTippable>
              <ToolTippable toolTipText={WCHint}>
                <Checkbox
                  checkedIcon={<MdWC />}
                  uncheckedIcon={
                    <MdWC style={{ fill: '#8c8c8c', opacity: '0.8' }} />
                  }
                  style={{ width: 'auto' }}
                  checked={WC}
                  onCheck={(e, v) => {
                    this.handleWCChange(v);
                  }}
                />
              </ToolTippable>
              <ToolTippable toolTipText={waitingRoomHint}>
                <Checkbox
                  checkedIcon={<WaitingRoom />}
                  uncheckedIcon={
                    <WaitingRoom style={{ fill: '#8c8c8c', opacity: '0.8' }} />
                  }
                  style={{ width: 'auto' }}
                  checked={waitingRoom}
                  onCheck={(e, v) => {
                    this.handleWaitingRoomChange(v);
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
                    this.handleChangeSign512(v);
                  }}
                />
              </ToolTippable>
            </div>}
        <AltNamesDialog
          open={altNamesDialogOpen}
          altNames={stopPlace.alternativeNames}
          intl={intl}
          disabled={disabled}
          handleClose={() => {
            this.setState({ altNamesDialogOpen: false });
          }}
        />
        <TariffZonesDialog
          open={tariffZoneOpen}
          tariffZones={stopPlace.tariffZones}
          intl={intl}
          disabled={disabled}
          handleClose={() => {
            this.setState({ tariffZoneOpen: false });
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  stopPlace: state.stopPlace.current,
});

export default connect(mapStateToProps)(StopPlaceDetails);
