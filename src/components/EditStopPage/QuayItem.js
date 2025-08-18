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

import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import {
  AssessmentActions,
  EquipmentActions,
  StopPlaceActions,
  UserActions,
} from "../../actions/";

import ContentCopy from "@mui/icons-material/ContentCopy";
import MdLess from "@mui/icons-material/ExpandLess";
import FlatButton from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { injectIntl } from "react-intl";
import equipmentHelpers from "../../modelUtils/equipmentHelpers";
import BusShelter from "../../static/icons/facilities/BusShelter";
import TicketMachine from "../../static/icons/facilities/TicketMachine";
import Sign512 from "../../static/icons/TransportSign";
import { getIn } from "../../utils/";
import EditQuayAdditional from "./EditQuayAdditional";
import ImportedId from "./ImportedId";

import WheelChair from "@mui/icons-material/Accessible";
import MdDelete from "@mui/icons-material/DeleteForever";
import MdKey from "@mui/icons-material/VpnKey";
import { getPrimaryDarkerColor } from "../../config/themeConfig";
import {
  AccessibilityLimitation,
  AccessibilityLimitationType,
} from "../../models/AccessibilityLimitation";
import StairsIcon from "../../static/icons/accessibility/Stairs";
import AccessibilityLimitationPopover from "./AccessibilityAssessment/AccessibilityLimitationPopover";
import Code from "./Code";
import Item from "./Item";
import ItemHeader from "./ItemHeader";
import ToolTippable from "./ToolTippable";

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
      coordinatesDialogOpen: false,
      copied: false,
    };
  }

  handleCopy = (event, textToCopy) => {
    event.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 1500);
      });
    }
  };

  handleDescriptionChange = (event) => {
    const { dispatch, index } = this.props;
    dispatch(
      StopPlaceActions.changeElementDescription(
        index,
        event.target.value,
        "quay",
      ),
    );
  };

  handlePublicCodeChange = (event) => {
    const { dispatch, index } = this.props;
    dispatch(
      StopPlaceActions.changePublicCodeName(index, event.target.value, "quay"),
    );
  };

  handlePrivateCodeChange = (event) => {
    const { dispatch, index } = this.props;
    dispatch(
      StopPlaceActions.changePrivateCodeName(index, event.target.value, "quay"),
    );
  };

  showMoreOptionsForQuay = (expanded) => {
    if (expanded) {
      this.props.dispatch(UserActions.showEditQuayAdditional());
    } else {
      this.props.dispatch(UserActions.hideEditQuayAdditional());
    }
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
      dispatch(EquipmentActions.updateTicketMachineState(value, "quay", index));
    }
  }

  handleBusShelterChange(value) {
    const { dispatch, disabled, index } = this.props;
    if (!disabled) {
      dispatch(
        EquipmentActions.updateShelterEquipmentState(value, "quay", index),
      );
    }
  }

  handleTransportSignChange(value) {
    const { dispatch, disabled, index } = this.props;
    if (!disabled) {
      dispatch(EquipmentActions.update512SignState(value, "quay", index));
    }
  }

  handleChangeCoordinates(position) {
    const { dispatch, index, handleLocateOnMap } = this.props;
    dispatch(
      StopPlaceActions.changeElementPosition(
        {
          markerIndex: index,
          type: "quay",
        },
        position,
      ),
    );
    handleLocateOnMap(position);
  }

  render() {
    const {
      quay,
      expanded,
      additionalExpanded,
      index,
      handleToggleCollapse,
      handleLocateOnMap,
      intl,
      stopPlaceType,
      disabled,
    } = this.props;
    const { formatMessage } = intl;

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
    const isTicketMachinePresent =
      equipmentHelpers.isTicketMachinePresent(quay);
    const isBusShelterPresent =
      equipmentHelpers.isShelterEquipmentPresent(quay);
    const isSign512Present = equipmentHelpers.is512SignEquipmentPresent(quay);

    const wheelChairHint = formatMessage({
      id: `accessibilityAssessments_wheelchairAccess_${wheelchairAccess.toLowerCase()}`,
    });
    const ticketMachineHint = isTicketMachinePresent
      ? formatMessage({ id: "ticketMachine" })
      : formatMessage({ id: "ticketMachine_no" });
    const busShelterHint = isBusShelterPresent
      ? formatMessage({ id: "busShelter" })
      : formatMessage({ id: "busShelter_no" });
    const transportSignHint = isSign512Present
      ? formatMessage({ id: "transport_sign" })
      : formatMessage({ id: "transport_sign_no" });
    const stepFreeHint = formatMessage({
      id: `accessibilityAssessments_stepFreeAccess_${stepFreeAccess.toLowerCase()}`,
    });
    const quayItemName = stopPlaceType
      ? formatMessage({ id: `stopTypes_${stopPlaceType}_quayItemName` })
      : null;

    const translations = {
      name: formatMessage({ id: "name" }),
      publicCode: formatMessage({ id: "publicCode" }),
      description: formatMessage({ id: "description" }),
      unsaved: formatMessage({ id: "unsaved" }),
      none: formatMessage({ id: "none_no" }),
      quays: formatMessage({ id: "quays" }),
      stepFreeAccess: formatMessage({ id: "step_free_access" }),
      noStepFreeAccess: formatMessage({ id: "step_free_access_no" }),
      wheelchairAccess: formatMessage({ id: "wheelchairAccess" }),
      noWheelchairAccess: formatMessage({ id: "wheelchairAccess_no" }),
      ticketMachine: formatMessage({ id: "ticketMachine" }),
      noTicketMachine: formatMessage({ id: "ticketMachine_no" }),
      busShelter: formatMessage({ id: "busShelter" }),
      noBusShelter: formatMessage({ id: "busShelter_no" }),
      quayItemName: formatMessage({ id: quayItemName || "name" }),
      quayMissingLocation: formatMessage({ id: "quay_is_missing_location" }),
      localReference: formatMessage({ id: "local_reference" }),
      privateCode: formatMessage({ id: "privateCode" }),
      notAssigned: formatMessage({ id: "not_assigned" }),
      copyId: formatMessage({ id: "copy_id" }),
      copied: formatMessage({ id: "copied" }),
    };

    const iconButtonStyle = {
      textAlign: "right",
      width: "100%",
      paddingBottom: 0,
      display: "flex",
      justifyContent: "flex-end",
    };

    const quayTitlePrefix = `${
      translations.quayItemName ? translations.quayItemName : ""
    } `;
    const idTitle = `${quay.id || "?"}`;

    return (
      <Item handleChangeCoordinates={this.handleChangeCoordinates}>
        <ItemHeader
          translations={translations}
          location={quay.location}
          expanded={expanded}
          handleLocateOnMap={() =>
            handleLocateOnMap(quay.location, index, "quay")
          }
          handleToggleCollapse={() => handleToggleCollapse(index, "quay")}
          handleMissingCoordinatesClick={() =>
            this.setState({ coordinatesDialogOpen: true })
          }
        >
          <span style={{ color: "#2196F3" }}>{quayTitlePrefix}</span>
          <Code
            type="publicCode"
            value={quay.publicCode}
            defaultValue={translations.notAssigned}
          />
          <Code
            type="privateCode"
            value={quay.privateCode}
            defaultValue={translations.notAssigned}
          />
          <span
            style={{
              fontSize: "0.8em",
              marginLeft: 5,
              fontWeight: 600,
              color: "#464545",
            }}
          >
            {idTitle}
          </span>
          <Tooltip
            title={
              this.state.copied ? translations.copied : translations.copyId
            }
            placement="top"
            onClose={() => this.setState({ copied: false })}
          >
            <IconButton
              size="small"
              onClick={(e) => this.handleCopy(e, idTitle)}
              style={{ marginLeft: 4, padding: 2 }}
            >
              <ContentCopy style={{ fontSize: "0.8em" }} />
            </IconButton>
          </Tooltip>
        </ItemHeader>
        {!expanded ? null : (
          <div className="quay-item-expanded">
            <ImportedId
              text={translations.localReference}
              id={quay.importedId}
            />
            <TextField
              variant="standard"
              style={{ width: "95%", marginTop: 10, marginLeft: 5 }}
              label={translations.publicCode}
              disabled={disabled}
              defaultValue={quay.publicCode}
              onChange={(e) =>
                typeof e.target.value === "string" &&
                this.handlePublicCodeChange(e)
              }
            />
            <TextField
              variant="standard"
              label={translations.privateCode}
              style={{ width: "95%", marginTop: 10, marginLeft: 5 }}
              disabled={disabled}
              defaultValue={quay.privateCode}
              onChange={(e) =>
                typeof e.target.value === "string" &&
                this.handlePrivateCodeChange(e)
              }
            />
            <TextField
              variant="standard"
              label={translations.description}
              style={{ width: "95%", marginTop: 10, marginLeft: 5 }}
              disabled={disabled}
              defaultValue={quay.description}
              onChange={(e) =>
                typeof e.target.value === "string" &&
                this.handleDescriptionChange(e)
              }
            />
            {!additionalExpanded ? (
              <div
                style={{
                  marginTop: 10,
                  marginBottom: 5,
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <ToolTippable toolTipText={wheelChairHint}>
                  <AccessibilityLimitationPopover
                    disabled={disabled}
                    accessibilityLimitationState={wheelchairAccess}
                    handleChange={this.handleWheelChairChange.bind(this)}
                    accessibilityLimitationName={
                      AccessibilityLimitation.WHEELCHAIR_ACCESS
                    }
                    icon={<WheelChair />}
                  />
                </ToolTippable>
                <ToolTippable toolTipText={stepFreeHint}>
                  <AccessibilityLimitationPopover
                    disabled={disabled}
                    accessibilityLimitationState={stepFreeAccess}
                    handleChange={this.handleStepFreeChange.bind(this)}
                    accessibilityLimitationName={
                      AccessibilityLimitation.STEP_FREE_ACCESS
                    }
                    icon={<StairsIcon />}
                  />
                </ToolTippable>
                <ToolTippable toolTipText={ticketMachineHint}>
                  <Checkbox
                    checkedIcon={<TicketMachine style={{ fill: "#000" }} />}
                    disabled={disabled}
                    icon={
                      <TicketMachine
                        style={{ fill: "#8c8c8c", opacity: "0.8" }}
                      />
                    }
                    style={{ width: "auto" }}
                    checked={isTicketMachinePresent}
                    onChange={(e, v) => {
                      this.handleTicketMachineChange(v);
                    }}
                  />
                </ToolTippable>
                <ToolTippable toolTipText={busShelterHint}>
                  <Checkbox
                    checkedIcon={<BusShelter style={{ fill: "#000" }} />}
                    disabled={disabled}
                    icon={
                      <BusShelter style={{ fill: "#8c8c8c", opacity: "0.8" }} />
                    }
                    style={{ width: "auto" }}
                    checked={isBusShelterPresent}
                    onChange={(e, v) => {
                      this.handleBusShelterChange(v);
                    }}
                  />
                </ToolTippable>
                <ToolTippable toolTipText={transportSignHint}>
                  <Checkbox
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
                    style={{ width: "auto" }}
                    checked={isSign512Present}
                    onChange={(event, v) => {
                      this.handleTransportSignChange(v);
                    }}
                  />
                </ToolTippable>
              </div>
            ) : null}
            <div style={{ textAlign: "center", width: "100%" }}>
              {additionalExpanded ? (
                <FlatButton onClick={() => this.showMoreOptionsForQuay(false)}>
                  <MdLess />
                </FlatButton>
              ) : (
                <FlatButton
                  style={{ marginTop: 5, marginBottom: -5 }}
                  label={formatMessage({ id: "more" })}
                  onClick={() => this.showMoreOptionsForQuay(true)}
                >
                  {formatMessage({ id: "more" })}
                </FlatButton>
              )}
              {additionalExpanded ? (
                <EditQuayAdditional
                  quay={quay}
                  index={index}
                  disabled={disabled}
                />
              ) : null}
            </div>
            <div style={iconButtonStyle}>
              <ToolTippable
                toolTipText={formatMessage({ id: "key_values_hint" })}
              >
                <IconButton onClick={this.props.handleOpenKeyValuesDialog}>
                  <MdKey
                    style={{
                      color: (quay.keyValues || []).length
                        ? getPrimaryDarkerColor()
                        : "#000",
                    }}
                  />
                </IconButton>
              </ToolTippable>
              <ToolTippable
                toolTipText={formatMessage({ id: "delete_quay" })}
                toolTipStyle={{ marginLeft: 10 }}
              >
                <IconButton
                  disabled={disabled}
                  onClick={this.props.handleRemoveQuay}
                >
                  <MdDelete style={{ color: "#df544a" }} />
                </IconButton>
              </ToolTippable>
            </div>
          </div>
        )}
      </Item>
    );
  }
}

const mapStateToProps = (state) => ({
  additionalExpanded: state.user.showEditQuayAdditional,
});

export default injectIntl(connect(mapStateToProps)(QuayItem));
