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
import Checkbox from "@mui/material/Checkbox";
import TicketMachine from "../../static/icons/facilities/TicketMachine";
import BusShelter from "../../static/icons/facilities/BusShelter";
import Divider from "@mui/material/Divider";
import MdWc from "@mui/icons-material/Wc";
import WaitingRoom from "../../static/icons/facilities/WaitingRoom";
import ToolTipIcon from "./ToolTipIcon";
import TextField from "@mui/material/TextField";
import MdMore from "@mui/icons-material/ExpandMore";
import MdLess from "@mui/icons-material/ExpandLess";
import FlatButton from "@mui/material/Button";
import StairsIcon from "../../static/icons/accessibility/Stairs";
import EnclosedIcon from "../../static/icons/facilities/Enclosed";
import Heated from "../../static/icons/facilities/Heated";
import { getIn } from "../../utils/";
import equiptmentHelpers from "../../modelUtils/equipmentHelpers";
import { EquipmentActions } from "../../actions/";
import Sign512 from "../../static/icons/TransportSign";
import TransportSign from "../../static/icons/TransportSign";
import { FormControlLabel } from "@mui/material";
import IconButton from "@mui/material/IconButton";

class FacilitiesStopTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedIndex: -1,
    };
  }

  handleExpandIndex(value) {
    this.setState({
      expandedIndex: value,
    });
  }

  handleCollapseIndex() {
    this.setState({
      expandedIndex: -1,
    });
  }

  handleTicketMachineChange(value) {
    if (!this.props.disabled) {
      this.props.dispatch(
        EquipmentActions.updateTicketMachineState(
          value,
          "stopPlace",
          this.props.stopPlace.id,
        ),
      );
    }
  }

  handleValueForTicketMachineChange(numberOfMachines) {
    this.handleTicketMachineChange({
      numberOfMachines,
      ticketMachines: numberOfMachines > 0,
    });
  }

  handleBusShelterChange(value) {
    if (!this.props.disabled) {
      this.props.dispatch(
        EquipmentActions.updateShelterEquipmentState(
          value,
          "stopPlace",
          this.props.stopPlace.id,
        ),
      );
    }
  }

  handleValueForBusShelterChange(newValue) {
    const { stopPlace } = this.props;
    const oldValuesSet = {
      seats: getIn(
        stopPlace,
        ["placeEquipments", "shelterEquipment", "seats"],
        0,
      ),
      stepFree: getIn(
        stopPlace,
        ["placeEquipments", "shelterEquipment", "stepFree"],
        false,
      ),
      enclosed: getIn(
        stopPlace,
        ["placeEquipments", "shelterEquipment", "enclosed"],
        false,
      ),
    };
    const newValuesSet = Object.assign({}, oldValuesSet, newValue);
    this.handleBusShelterChange(newValuesSet);
  }

  handleWCChange(value) {
    if (!this.props.disabled) {
      this.props.dispatch(
        EquipmentActions.updateSanitaryState(
          value,
          "stopPlace",
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
          "stopPlace",
          this.props.stopPlace.id,
        ),
      );
    }
  }

  handle512Sign(value) {
    if (!this.props.disabled) {
      this.props.dispatch(
        EquipmentActions.update512SignState(
          value,
          "stopPlace",
          this.props.stopPlace.id,
        ),
      );
    }
  }

  handleValueForWaitingRoomChange(newValue) {
    const { stopPlace } = this.props;
    const oldValuesSet = {
      seats: getIn(
        stopPlace,
        ["placeEquipments", "waitingRoomEquipment", "seats"],
        0,
      ),
      heated: getIn(
        stopPlace,
        ["placeEquipments", "waitingRoomEquipment", "heated"],
        false,
      ),
      stepFree: getIn(
        stopPlace,
        ["placeEquipments", "waitingRoomEquipment", "stepFree"],
        false,
      ),
    };
    const newValuesSet = Object.assign({}, oldValuesSet, newValue);
    this.handleWaitingRoomChange(newValuesSet);
  }

  render() {
    const { disabled, intl, stopPlace } = this.props;
    const { formatMessage } = intl;
    const { expandedIndex } = this.state;

    const ticketMachine = equiptmentHelpers.getTicketMachineState(stopPlace);
    const busShelter = equiptmentHelpers.getShelterEquipmentState(stopPlace);
    const waitingRoom = equiptmentHelpers.getWaitingRoomState(stopPlace);
    const WC = equiptmentHelpers.getSanitaryEquipmentState(stopPlace);
    const sign512 = equiptmentHelpers.get512SignEquipment(stopPlace);

    console.log(stopPlace);

    const ticketMachineNumber = getIn(
      stopPlace,
      ["placeEquipments", "ticketingEquipment", "numberOfMachines"],
      0,
    );
    const shelterSeats = getIn(
      stopPlace,
      ["placeEquipments", "shelterEquipment", "seats"],
      0,
    );
    const shelterStepFree = getIn(
      stopPlace,
      ["placeEquipments", "shelterEquipment", "stepFree"],
      false,
    );
    const shelterEnclosed = getIn(
      stopPlace,
      ["placeEquipments", "shelterEquipment", "enclosed"],
      false,
    );
    const waitingRoomSeats = getIn(
      stopPlace,
      ["placeEquipments", "waitingRoomEquipment", "seats"],
      0,
    );
    const waitingRoomHeated = getIn(
      stopPlace,
      ["placeEquipments", "waitingRoomEquipment", "heated"],
      false,
    );
    const waitingRoomStepFree = getIn(
      stopPlace,
      ["placeEquipments", "waitingRoomEquipment", "stepFree"],
      false,
    );

    return (
      <div style={{ padding: 10 }}>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sign512}
                  checkedIcon={<TransportSign />}
                  icon={
                    <TransportSign
                      style={{
                        fill: "#8c8c8c",
                        opacity: "0.8",
                      }}
                    />
                  }
                  style={{ width: "auto" }}
                  onChange={(e, v) => {
                    this.handle512Sign(v);
                  }}
                />
              }
              label={
                <div style={{ fontSize: "0.8em" }}>
                  {sign512
                    ? formatMessage({ id: "transport_sign" })
                    : formatMessage({ id: "transport_sign_no" })}
                </div>
              }
            />
            <ToolTipIcon title={formatMessage({ id: "transport_sign_hint" })} />
          </div>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={ticketMachine}
                  checkedIcon={<TicketMachine />}
                  icon={
                    <TicketMachine
                      style={{ fill: "#8c8c8c", opacity: "0.8" }}
                    />
                  }
                  onChange={(e, v) => {
                    this.handleTicketMachineChange(v);
                  }}
                />
              }
              label={
                <div style={{ fontSize: "0.8em" }}>
                  {ticketMachine
                    ? formatMessage({ id: "ticketMachine" })
                    : formatMessage({ id: "ticketMachine_no" })}
                </div>
              }
            />
            <ToolTipIcon
              title={formatMessage({ id: "ticketMachine_stop_hint" })}
            />
          </div>
          {expandedIndex === 0 ? (
            <div>
              <TextField
                hintText={formatMessage({ id: "number_of_ticket_machines" })}
                type="number"
                value={ticketMachineNumber}
                disabled={disabled}
                onChange={(event, value) => {
                  this.handleValueForTicketMachineChange(value);
                }}
                min="0"
                fullWidth={true}
                floatingLabelText={formatMessage({
                  id: "number_of_ticket_machines",
                })}
              />
            </div>
          ) : null}
          <div style={{ textAlign: "center", marginBottom: 5 }}>
            {expandedIndex === 0 ? (
              <IconButton
                style={{ height: 20, minWidth: 20, width: 20 }}
                onClick={() => this.handleCollapseIndex(0)}
              >
                <MdLess style={{ height: 16, width: 16 }} />
              </IconButton>
            ) : (
              <IconButton
                style={{ height: 20, minWidth: 20, width: 20 }}
                onClick={() => this.handleExpandIndex(0)}
              >
                <MdMore style={{ height: 16, width: 16 }} />
              </IconButton>
            )}
          </div>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={busShelter}
                  checkedIcon={<BusShelter />}
                  icon={
                    <BusShelter style={{ fill: "#8c8c8c", opacity: "0.8" }} />
                  }
                  onChange={(e, v) => {
                    this.handleBusShelterChange(v);
                  }}
                />
              }
              label={
                <div style={{ fontSize: "0.8em" }}>
                  {busShelter
                    ? formatMessage({ id: "busShelter" })
                    : formatMessage({ id: "busShelter_no" })}
                </div>
              }
            />
            <ToolTipIcon
              title={formatMessage({ id: "busShelter_stop_hint" })}
            />
          </div>
          {expandedIndex === 1 ? (
            <div>
              <TextField
                hintText={formatMessage({ id: "number_of_seats" })}
                value={shelterSeats}
                type="number"
                onChange={(event, value) => {
                  this.handleValueForBusShelterChange({ seats: value });
                }}
                min="0"
                fullWidth={true}
                floatingLabelText={formatMessage({ id: "number_of_seats" })}
              />
              <div style={{ display: "block" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <Checkbox
                    checked={shelterStepFree}
                    onChange={(e, v) => {
                      this.handleValueForBusShelterChange({ stepFree: v });
                    }}
                    checkedIcon={<StairsIcon />}
                    style={{ width: "auto" }}
                    label={
                      shelterStepFree
                        ? formatMessage({ id: "step_free_access" })
                        : formatMessage({ id: "step_free_access_no" })
                    }
                    icon={
                      <StairsIcon style={{ fill: "#8c8c8c", opacity: "0.8" }} />
                    }
                    labelStyle={{ fontSize: "0.8em" }}
                  />
                  <Checkbox
                    checked={shelterEnclosed}
                    checkedIcon={<EnclosedIcon />}
                    icon={
                      <EnclosedIcon
                        style={{ fill: "#8c8c8c", opacity: "0.8" }}
                      />
                    }
                    label={
                      shelterEnclosed
                        ? formatMessage({ id: "enclosed" })
                        : formatMessage({ id: "enclosed_no" })
                    }
                    labelStyle={{ fontSize: "0.8em" }}
                    style={{ width: "auto" }}
                    onChange={(e, v) => {
                      this.handleValueForBusShelterChange({ enclosed: v });
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null}
          <div style={{ textAlign: "center", marginBottom: 5 }}>
            {expandedIndex === 1 ? (
              <IconButton
                style={{ height: 20, minWidth: 20, width: 20 }}
                onClick={() => this.handleCollapseIndex(1)}
              >
                <MdLess style={{ height: 16, width: 16 }} />
              </IconButton>
            ) : (
              <IconButton
                style={{ height: 20, minWidth: 20, width: 20 }}
                onClick={() => this.handleExpandIndex(1)}
              >
                <MdMore style={{ height: 16, width: 16 }} />
              </IconButton>
            )}
          </div>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={WC}
                  checkedIcon={<MdWc />}
                  icon={<MdWc style={{ fill: "#8c8c8c", opacity: "0.8" }} />}
                  onChange={(e, v) => {
                    this.handleWCChange(v);
                  }}
                />
              }
              label={
                <div style={{ fontSize: "0.8em" }}>
                  {WC
                    ? formatMessage({ id: "wc" })
                    : formatMessage({ id: "wc_no" })}
                </div>
              }
            />
            <ToolTipIcon title={formatMessage({ id: "wc_stop_hint" })} />
          </div>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={waitingRoom}
                  checkedIcon={<WaitingRoom />}
                  icon={
                    <WaitingRoom style={{ fill: "#8c8c8c", opacity: "0.8" }} />
                  }
                  onChange={(e, v) => {
                    this.handleWaitingRoomChange(v);
                  }}
                />
              }
              label={
                <div style={{ fontSize: "0.8em" }}>
                  {waitingRoom
                    ? formatMessage({ id: "waiting_room" })
                    : formatMessage({ id: "waiting_room_no" })}
                </div>
              }
            />
            <ToolTipIcon
              title={formatMessage({ id: "waitingroom_stop_hint" })}
            />
          </div>
          {expandedIndex === 3 ? (
            <div>
              <TextField
                hintText={formatMessage({ id: "number_of_seats" })}
                type="number"
                value={waitingRoomSeats}
                disabled={disabled}
                onChange={(event, value) => {
                  this.handleValueForWaitingRoomChange({ seats: value });
                }}
                min="0"
                fullWidth={true}
                floatingLabelText={formatMessage({ id: "number_of_seats" })}
              />
              <div style={{ display: "block" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <Checkbox
                    checked={waitingRoomStepFree}
                    checkedIcon={<StairsIcon />}
                    style={{ width: "auto" }}
                    label={
                      waitingRoomStepFree
                        ? formatMessage({ id: "step_free_access" })
                        : formatMessage({ id: "step_free_access_no" })
                    }
                    icon={
                      <StairsIcon style={{ fill: "#8c8c8c", opacity: "0.8" }} />
                    }
                    labelStyle={{ fontSize: "0.8em" }}
                    onChange={(e, v) => {
                      this.handleValueForWaitingRoomChange({ stepFree: v });
                    }}
                  />
                  <Checkbox
                    checked={waitingRoomHeated}
                    checkedIcon={<Heated />}
                    icon={
                      <Heated style={{ fill: "#8c8c8c", opacity: "0.8" }} />
                    }
                    label={
                      waitingRoomHeated
                        ? formatMessage({ id: "heating" })
                        : formatMessage({ id: "heating_no" })
                    }
                    labelStyle={{ fontSize: "0.8em" }}
                    style={{ width: "auto" }}
                    onChange={(e, v) => {
                      this.handleValueForWaitingRoomChange({ heated: v });
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null}
          <div style={{ textAlign: "center", marginBottom: 5 }}>
            {expandedIndex === 3 ? (
              <IconButton
                style={{ height: 20, minWidth: 20, width: 20 }}
                onClick={() => this.handleCollapseIndex(3)}
              >
                <MdLess style={{ height: 16, width: 16 }} />
              </IconButton>
            ) : (
              <IconButton
                style={{ height: 20, minWidth: 20, width: 20 }}
                onClick={() => this.handleExpandIndex(3)}
              >
                <MdMore style={{ height: 16, width: 16 }} />
              </IconButton>
            )}
          </div>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  stopPlace: state.stopPlace.current,
});

export default connect(mapStateToProps)(FacilitiesStopTab);
