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
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import React from "react";
import { connect } from "react-redux";
import { EquipmentActions } from "../../actions/";
import equiptmentHelpers from "../../modelUtils/equipmentHelpers";
import StairsIcon from "../../static/icons/accessibility/Stairs";
import BusShelter from "../../static/icons/facilities/BusShelter";
import EnclosedIcon from "../../static/icons/facilities/Enclosed";
import Heated from "../../static/icons/facilities/Heated";
import TicketMachine from "../../static/icons/facilities/TicketMachine";
import WaitingRoom from "../../static/icons/facilities/WaitingRoom";
import TransportSign from "../../static/icons/TransportSign";
import { getIn } from "../../utils/";
import ToolTipIcon from "./ToolTipIcon";

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
    if (numberOfMachines < 0) {
      numberOfMachines = 0;
    }
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
    if (newValue < 0) {
      newValue = 0;
    }
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
    if (newValue < 0) {
      newValue = 0;
    }
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

    const isTicketMachinePresent =
      equiptmentHelpers.isTicketMachinePresent(stopPlace);
    const isBusShelterPresent =
      equiptmentHelpers.isShelterEquipmentPresent(stopPlace);
    const isWaitingRoomPresent =
      equiptmentHelpers.isWaitingRoomPresent(stopPlace);
    const isWCPresent = equiptmentHelpers.isSanitaryEquipmentPresent(stopPlace);
    const isSign512Present =
      equiptmentHelpers.is512SignEquipmentPresent(stopPlace);

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
                  checked={isSign512Present}
                  checkedIcon={<TransportSign style={{ fill: "#000" }} />}
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
                  {isSign512Present
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
                  checked={isTicketMachinePresent}
                  checkedIcon={<TicketMachine style={{ fill: "#000" }} />}
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
                //defaultValue={ticketMachineNumber}
                value={ticketMachineNumber}
                disabled={disabled}
                onChange={(event) => {
                  this.handleValueForTicketMachineChange(event.target.value);
                }}
                fullWidth={true}
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
                variant="filled"
                value={shelterSeats}
                type="number"
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
                        onChange={(e, v) => {
                          this.handleValueForBusShelterChange({ stepFree: v });
                        }}
                        checkedIcon={<StairsIcon style={{ fill: "#000" }} />}
                        style={{ width: "auto" }}
                        label={
                          shelterStepFree
                            ? formatMessage({ id: "step_free_access" })
                            : formatMessage({ id: "step_free_access_no" })
                        }
                        icon={
                          <StairsIcon
                            style={{ fill: "#8c8c8c", opacity: "0.8" }}
                          />
                        }
                        labelStyle={{ fontSize: "0.8em" }}
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
                  checked={isWCPresent}
                  checkedIcon={<MdWc style={{ fill: "#000" }} />}
                  icon={<MdWc style={{ fill: "#8c8c8c", opacity: "0.8" }} />}
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
                label={formatMessage({ id: "number_of_seats" })}
                variant="filled"
                type="number"
                value={waitingRoomSeats}
                //defaultValue={waitingRoomSeats}
                //disabled={disabled}
                onChange={(event, value) => {
                  this.handleValueForWaitingRoomChange({
                    seats: event.target.value,
                  });
                }}
                min="0"
                fullWidth={true}
                InputLabelProps={{ shrink: true }}
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
                        label={
                          waitingRoomStepFree
                            ? formatMessage({ id: "step_free_access" })
                            : formatMessage({ id: "step_free_access_no" })
                        }
                        icon={
                          <StairsIcon
                            style={{ fill: "#8c8c8c", opacity: "0.8" }}
                          />
                        }
                        labelStyle={{ fontSize: "0.8em" }}
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
