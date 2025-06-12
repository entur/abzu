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

import MdLess from "@mui/icons-material/ExpandLess";
import MdMore from "@mui/icons-material/ExpandMore";
import MdWc from "@mui/icons-material/Wc";
import { FormControlLabel } from "@mui/material";
import FlatButton from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import React from "react";
import { connect } from "react-redux";
import { EquipmentActions } from "../../actions/";
import equipmentHelpers from "../../modelUtils/equipmentHelpers";
import StairsIcon from "../../static/icons/accessibility/Stairs";
import BusShelter from "../../static/icons/facilities/BusShelter";
import EnclosedIcon from "../../static/icons/facilities/Enclosed";
import Heated from "../../static/icons/facilities/Heated";
import TicketMachine from "../../static/icons/facilities/TicketMachine";
import WaitingRoom from "../../static/icons/facilities/WaitingRoom";
import Sign512 from "../../static/icons/TransportSign";
import { getIn } from "../../utils/";
import ToolTipIcon from "./ToolTipIcon";

class FacilitiesQuayTab extends React.Component {
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

  handleCollapseIndex(value) {
    this.setState({
      expandedIndex: -1,
    });
  }

  handleTicketMachineChange(value) {
    const { index, disabled, dispatch } = this.props;
    if (!disabled) {
      dispatch(EquipmentActions.updateTicketMachineState(value, "quay", index));
    }
  }

  handleValueForTicketMachineChange(numberOfMachines) {
    if (numberOfMachines < 0) {
      numberOfMachines = 0;
    }
    this.handleTicketMachineChange({
      numberOfMachines,
      ticketOffice: numberOfMachines > 0,
      ticketMachines: numberOfMachines > 0,
    });
  }

  handleBusShelterChange(value) {
    const { index, disabled, dispatch } = this.props;
    if (!disabled) {
      dispatch(
        EquipmentActions.updateShelterEquipmentState(value, "quay", index),
      );
    }
  }

  handleValueForBusShelterChange(newValue) {
    if (newValue.seats < 0) {
      newValue.seats = 0;
    }
    const { quay } = this.props;
    const oldValuesSet = {
      seats: getIn(quay, ["placeEquipments", "shelterEquipment", "seats"], 0),
      stepFree: getIn(
        quay,
        ["placeEquipments", "shelterEquipment", "stepFree"],
        false,
      ),
      enclosed: getIn(
        quay,
        ["placeEquipments", "shelterEquipment", "enclosed"],
        false,
      ),
    };
    const newValuesSet = Object.assign({}, oldValuesSet, newValue);
    this.handleBusShelterChange(newValuesSet);
  }

  handleWCChange(value) {
    const { index, disabled, dispatch } = this.props;
    if (!disabled) {
      dispatch(EquipmentActions.updateSanitaryState(value, "quay", index));
    }
  }

  handleWaitingRoomChange(value) {
    const { index, disabled, dispatch } = this.props;
    if (!disabled) {
      dispatch(EquipmentActions.updateWaitingRoomState(value, "quay", index));
    }
  }

  handleValueForWaitingRoomChange(newValue) {
    if (newValue.seats < 0) {
      newValue.seats = 0;
    }
    const { quay } = this.props;
    const oldValuesSet = {
      seats: getIn(
        quay,
        ["placeEquipments", "waitingRoomEquipment", "seats"],
        0,
      ),
      heated: getIn(
        quay,
        ["placeEquipments", "waitingRoomEquipment", "heated"],
        false,
      ),
      stepFree: getIn(
        quay,
        ["placeEquipments", "waitingRoomEquipment", "stepFree"],
        false,
      ),
    };
    const newValuesSet = Object.assign({}, oldValuesSet, newValue);
    this.handleWaitingRoomChange(newValuesSet);
  }

  handle512Sign(value) {
    if (!this.props.disabled) {
      this.props.dispatch(
        EquipmentActions.update512SignState(value, "quay", this.props.index),
      );
    }
  }

  render() {
    const { intl, disabled, quay } = this.props;
    const { formatMessage } = intl;
    const { expandedIndex } = this.state;

    const isTicketMachinePresent =
      equipmentHelpers.isTicketMachinePresent(quay);
    const isBusShelterPresent =
      equipmentHelpers.isShelterEquipmentPresent(quay);
    const isWaitingRoomPresent = equipmentHelpers.isWaitingRoomPresent(quay);
    const isWCPresent = equipmentHelpers.isSanitaryEquipmentPresent(quay);

    const ticketMachineNumber = getIn(
      quay,
      ["placeEquipments", "ticketingEquipment", "numberOfMachines"],
      0,
    );
    const shelterSeats = getIn(
      quay,
      ["placeEquipments", "shelterEquipment", "seats"],
      0,
    );
    const shelterStepFree = getIn(
      quay,
      ["placeEquipments", "shelterEquipment", "stepFree"],
      false,
    );
    const shelterEnclosed = getIn(
      quay,
      ["placeEquipments", "shelterEquipment", "enclosed"],
      false,
    );
    const waitingRoomSeats = getIn(
      quay,
      ["placeEquipments", "waitingRoomEquipment", "seats"],
      0,
    );
    const waitingRoomHeated = getIn(
      quay,
      ["placeEquipments", "waitingRoomEquipment", "heated"],
      false,
    );
    const waitingRoomStepFree = getIn(
      quay,
      ["placeEquipments", "waitingRoomEquipment", "stepFree"],
      false,
    );
    const isSign512Present = equipmentHelpers.is512SignEquipmentPresent(quay);

    return (
      <div style={{ padding: 10 }}>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isSign512Present}
                  checkedIcon={<Sign512 />}
                  disabled={disabled}
                  icon={
                    <Sign512
                      style={{
                        fill: "#8c8c8c",
                        opacity: "0.8",
                      }}
                    />
                  }
                  onChange={(e, v) => {
                    this.handle512Sign(v);
                  }}
                />
              }
              label={
                <div style={{ fontSize: "0.8em" }}>
                  {isSign512Present
                    ? formatMessage({ id: "transport_sign" })
                    : formatMessage({ id: "transport_sign_no" })}
                </div>
              }
            />
            <ToolTipIcon
              title={formatMessage({ id: "transport_sign_quay_hint" })}
            />
          </div>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isTicketMachinePresent}
                  checkedIcon={<TicketMachine style={{ fill: "#000" }} />}
                  icon={
                    <TicketMachine
                      style={{ fill: "#8c8c8c", opacity: "0.8" }}
                    />
                  }
                  labelStyle={{ fontSize: "0.8em" }}
                  onChange={(e, v) => {
                    this.handleTicketMachineChange(v);
                  }}
                />
              }
              label={
                <div style={{ fontSize: "0.8em" }}>
                  {isTicketMachinePresent
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
                label={formatMessage({ id: "number_of_ticket_machines" })}
                type="number"
                variant="filled"
                value={ticketMachineNumber}
                disabled={disabled}
                min="0"
                fullWidth={true}
                onChange={(event) => {
                  this.handleValueForTicketMachineChange(event.target.value);
                }}
              />
            </div>
          ) : null}
          <div style={{ textAlign: "center", marginBottom: 5 }}>
            {expandedIndex === 0 ? (
              <FlatButton
                style={{ height: 20, minWidth: 20, width: 20 }}
                onClick={() => this.handleCollapseIndex(0)}
              >
                <MdLess style={{ height: 16, width: 16 }} />
              </FlatButton>
            ) : (
              <FlatButton
                style={{ height: 20, minWidth: 20, width: 20 }}
                onClick={() => this.handleExpandIndex(0)}
              >
                <MdMore style={{ height: 16, width: 16 }} />
              </FlatButton>
            )}
          </div>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isBusShelterPresent}
                  checkedIcon={<BusShelter style={{ fill: "#000" }} />}
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
                  {isBusShelterPresent
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
                label={formatMessage({ id: "number_of_seats" })}
                type="number"
                variant="filled"
                value={shelterSeats}
                onChange={(event) => {
                  this.handleValueForBusShelterChange({
                    seats: event.target.value,
                  });
                }}
                min="0"
                fullWidth={true}
              />
              <div style={{ display: "block" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={shelterStepFree}
                        checkedIcon={<StairsIcon style={{ fill: "#000" }} />}
                        style={{ width: "auto" }}
                        icon={
                          <StairsIcon
                            style={{ fill: "#8c8c8c", opacity: "0.8" }}
                          />
                        }
                        labelStyle={{ fontSize: "0.8em" }}
                        onChange={(e, v) => {
                          this.handleValueForBusShelterChange({ stepFree: v });
                        }}
                      />
                    }
                    label={
                      <div style={{ fontSize: "0.8em" }}>
                        {shelterStepFree
                          ? formatMessage({ id: "step_free_access" })
                          : formatMessage({ id: "step_free_access_no" })}
                      </div>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={shelterEnclosed}
                        checkedIcon={<EnclosedIcon style={{ fill: "#000" }} />}
                        icon={
                          <EnclosedIcon
                            style={{ fill: "#8c8c8c", opacity: "0.8" }}
                          />
                        }
                        style={{ width: "auto" }}
                        onChange={(e, v) => {
                          this.handleValueForBusShelterChange({ enclosed: v });
                        }}
                      />
                    }
                    label={
                      <div style={{ fontSize: "0.8em" }}>
                        {shelterEnclosed
                          ? formatMessage({ id: "enclosed" })
                          : formatMessage({ id: "enclosed_no" })}
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          ) : null}
          <div style={{ textAlign: "center", marginBottom: 5 }}>
            {expandedIndex === 1 ? (
              <FlatButton
                style={{ height: 20, minWidth: 20, width: 20 }}
                onClick={() => this.handleCollapseIndex(1)}
              >
                <MdLess style={{ height: 16, width: 16 }} />
              </FlatButton>
            ) : (
              <FlatButton
                style={{ height: 20, minWidth: 20, width: 20 }}
                onClick={() => this.handleExpandIndex(1)}
              >
                <MdMore style={{ height: 16, width: 16 }} />
              </FlatButton>
            )}
          </div>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isWCPresent}
                  checkedIcon={<MdWc style={{ fill: "#000" }} />}
                  icon={<MdWc style={{ fill: "#8c8c8c", opacity: "0.8" }} />}
                  labelStyle={{ fontSize: "0.8em" }}
                  onChange={(e, v) => {
                    this.handleWCChange(v);
                  }}
                />
              }
              label={
                <div style={{ fontSize: "0.8em" }}>
                  {isWCPresent
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
                  checked={isWaitingRoomPresent}
                  checkedIcon={<WaitingRoom style={{ fill: "#000" }} />}
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
                  {isWaitingRoomPresent
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
                variant="filled"
                value={waitingRoomSeats}
                disabled={disabled}
                onChange={(event) => {
                  this.handleValueForWaitingRoomChange({
                    seats: event.target.value,
                  });
                }}
                min="0"
                fullWidth={true}
                label={formatMessage({ id: "number_of_seats" })}
              />
              <div style={{ display: "block" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={waitingRoomStepFree}
                        checkedIcon={<StairsIcon style={{ fill: "#000" }} />}
                        style={{ width: "auto" }}
                        icon={
                          <StairsIcon
                            style={{ fill: "#8c8c8c", opacity: "0.8" }}
                          />
                        }
                        onChange={(e, v) => {
                          this.handleValueForWaitingRoomChange({ stepFree: v });
                        }}
                      />
                    }
                    label={
                      <div style={{ fontSize: "0.8em" }}>
                        {waitingRoomStepFree
                          ? formatMessage({ id: "step_free_access" })
                          : formatMessage({ id: "step_free_access_no" })}
                      </div>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={waitingRoomHeated}
                        checkedIcon={<Heated style={{ fill: "#000" }} />}
                        icon={
                          <Heated style={{ fill: "#8c8c8c", opacity: "0.8" }} />
                        }
                        style={{ width: "auto" }}
                        onChange={(e, v) => {
                          this.handleValueForWaitingRoomChange({ heated: v });
                        }}
                      />
                    }
                    label={
                      <div style={{ fontSize: "0.8em" }}>
                        {waitingRoomHeated
                          ? formatMessage({ id: "heating" })
                          : formatMessage({ id: "heating_no" })}
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          ) : null}
          <div style={{ textAlign: "center", marginBottom: 5 }}>
            {expandedIndex === 3 ? (
              <FlatButton
                style={{ height: 20, minWidth: 20, width: 20 }}
                onClick={() => this.handleCollapseIndex(3)}
              >
                <MdLess style={{ height: 16, width: 16 }} />
              </FlatButton>
            ) : (
              <FlatButton
                style={{ height: 20, minWidth: 20, width: 20 }}
                onClick={() => this.handleExpandIndex(3)}
              >
                <MdMore style={{ height: 16, width: 16 }} />
              </FlatButton>
            )}
          </div>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        </div>
      </div>
    );
  }
}

export default connect(null)(FacilitiesQuayTab);
