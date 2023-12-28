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
import { styled } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { injectIntl } from "react-intl";
import { parkingPaymentProcesses } from "../../models/parkingPaymentProcess";
import { parkingLayouts } from "../../models/parkingLayout";
import { TextField, Subheader } from "material-ui";
import RechargingAvailablePopover from "./RechargingAvailablePopover";
import LocalParking from "material-ui/svg-icons/maps/local-parking";
import { ActionAccessible } from "material-ui/svg-icons";
import Payment from "material-ui/svg-icons/action/payment";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
const PREFIX = "ParkingItemPayAndRideExpandedFields";

const classes = {
  mainGrid: `${PREFIX}-mainGrid`,
  gridItemMargin: `${PREFIX}-gridItemMargin`,
  boxFullWidth: `${PREFIX}-boxFullWidth`,
  textField: `${PREFIX}-textField`,
  selectInput: `${PREFIX}-selectInput`,
  info: `${PREFIX}-info`,
};

const StyledGrid = styled(Grid)(() => ({
  [`&.${classes.mainGrid}`]: {
    marginTop: ".5rem",
  },

  [`& .${classes.gridItemMargin}`]: {
    marginLeft: "55px",
  },

  [`& .${classes.boxFullWidth}`]: {
    width: "100%",
  },

  [`& .${classes.textField}`]: {
    marginTop: -10,
  },

  [`& .${classes.selectInput}`]: {
    width: "100%",
  },

  [`& .${classes.info}`]: {
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "12px",
    paddingLeft: "16px",
    width: "100%",
    marginBlockStart: 0,
  },
}));

const Info = ({ children }) => {
  return <p className={classes.info}>{children}</p>;
};

const parkingIconStyles = (topMargin = 15) => ({
  margin: `${topMargin}px 22px 18px 10px`,
});

const hasElements = (list) => list && list.length > 0;

const hasValue = (value) => value !== null && value !== undefined;

const getRechargingAvailableValue = (value) => (hasValue(value) ? value : null);

const parkingPaymentProcessSelectFieldValue = (parkingPaymentProcess) => {
  return hasElements(parkingPaymentProcess)
    ? parkingPaymentProcess.map((value) => `${value}`)
    : [];
};

const parkingPaymentProcessChecked = (parkingPaymentProcess, key) => {
  const parkingPaymentProcessHasElements = hasElements(parkingPaymentProcess);
  if (!parkingPaymentProcessHasElements) {
    return false;
  }
  return parkingPaymentProcess.indexOf(key) > -1;
};

const ParkingItemPayAndRideExpandedFields = (props) => {
  const {
    intl: { formatMessage },
    disabled,
    hasExpired,
    parkingLayout,
    parkingPaymentProcess,
    rechargingAvailable,
    totalCapacity,
    numberOfSpaces,
    numberOfSpacesWithRechargePoint,
    numberOfSpacesForRegisteredDisabledUserType,
    handleSetParkingLayout,
    handleSetParkingPaymentProcess,
    handleSetRechargingAvailable,
    handleSetNumberOfSpaces,
    handleSetNumberOfSpacesWithRechargePoint,
    handleSetNumberOfSpacesForRegisteredDisabledUserType,
  } = props;

  return (
    <StyledGrid
      container
      alignItems="stretch"
      direction="column"
      spacing={2}
      className={classes.mainGrid}
    >
      <Grid item className={classes.gridItemMargin}>
        <InputLabel htmlFor="select-parking-layout">
          {formatMessage({ id: "parking_layout" })}
        </InputLabel>
        <Select
          variant="standard"
          displayEmpty
          disabled={disabled || hasExpired}
          value={parkingLayout}
          input={
            <Input className={classes.selectInput} id="select-parking-layout" />
          }
          renderValue={(selected) =>
            selected ? (
              formatMessage({ id: `parking_layout_${selected}` })
            ) : (
              <em>{formatMessage({ id: "parking_layout_undefined" })}</em>
            )
          }
          onChange={(event) => {
            const { value } = event.target;
            if (value === parkingLayout) {
              handleSetParkingLayout(null);
            } else {
              handleSetParkingLayout(value);
            }
          }}
        >
          {parkingLayouts.map((key) => (
            <MenuItem key={key} value={key}>
              <Checkbox checked={key === parkingLayout} />
              <ListItemText
                primary={formatMessage({ id: `parking_layout_${key}` })}
              />
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item>
        <Box
          display="flex"
          flexDirection="row"
          className={classes.boxFullWidth}
        >
          <Box>
            <Payment style={parkingIconStyles(6)} />
          </Box>
          <Box className={classes.boxFullWidth}>
            <InputLabel htmlFor="select-multiple-parking-payment-process">
              {formatMessage({ id: "parking_payment_process" })}
            </InputLabel>
            <Select
              variant="standard"
              multiple
              displayEmpty
              disabled={disabled || hasExpired}
              value={parkingPaymentProcessSelectFieldValue(
                parkingPaymentProcess,
              )}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return (
                    <em>
                      {formatMessage({
                        id: "parking_payment_process_undefined",
                      })}
                    </em>
                  );
                }

                return selected
                  .map((key) => {
                    return formatMessage({
                      id: `parking_payment_process_${key}`,
                    });
                  })
                  .join(", ");
              }}
              input={
                <Input
                  className={classes.selectInput}
                  id="select-multiple-parking-payment-process"
                />
              }
              onChange={(event) => {
                const { value } = event.target;
                handleSetParkingPaymentProcess(value);
              }}
            >
              {parkingPaymentProcesses.map((key) => (
                <MenuItem key={key} value={key}>
                  <Checkbox
                    checked={parkingPaymentProcessChecked(
                      parkingPaymentProcess,
                      key,
                    )}
                  />
                  <ListItemText
                    primary={formatMessage({
                      id: `parking_payment_process_${key}`,
                    })}
                    secondary={
                      key === `payByPrepaidToken`
                        ? formatMessage({
                            id: `parking_payment_process_${key}_hover`,
                          })
                        : null
                    }
                  />
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Grid>
      <Grid item>
        <Subheader>
          {formatMessage({ id: "parking_parkAndRide_capacity_sub_header" })} (
          {`${totalCapacity}`})
        </Subheader>
        <Box
          display="flex"
          flexDirection="row"
          className={classes.boxFullWidth}
        >
          <LocalParking style={parkingIconStyles()} />
          <TextField
            variant="standard"
            disabled={disabled || hasExpired}
            floatingLabelText={formatMessage({
              id: "parking_number_of_spaces",
            })}
            onChange={(_e, value) => {
              handleSetNumberOfSpaces(value);
            }}
            value={numberOfSpaces || ""}
            type="number"
            fullWidth
            className={classes.textField}
          />
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          className={classes.boxFullWidth}
        >
          <ActionAccessible style={parkingIconStyles()} />
          <TextField
            variant="standard"
            hintText={formatMessage({
              id: "parking_number_of_spaces_for_registered_disabled_user_type",
            })}
            disabled={disabled || hasExpired}
            floatingLabelText={formatMessage({
              id: "parking_number_of_spaces_for_registered_disabled_user_type",
            })}
            onChange={(e, value) => {
              handleSetNumberOfSpacesForRegisteredDisabledUserType(value);
            }}
            value={numberOfSpacesForRegisteredDisabledUserType || ""}
            type="number"
            fullWidth
            className={classes.textField}
          />
        </Box>
      </Grid>
      <Grid item>
        <Subheader>
          {formatMessage({ id: "parking_recharging_sub_header" })}
        </Subheader>
        <Info>
          {formatMessage({ id: "parking_recharging_available_info" })}
        </Info>
        <Box
          display="flex"
          flexDirection="row"
          className={classes.boxFullWidth}
        >
          <RechargingAvailablePopover
            disabled={disabled}
            hasExpired={hasExpired}
            handleSetRechargingAvailable={handleSetRechargingAvailable}
            handleSetNumberOfSpacesWithRechargePoint={
              handleSetNumberOfSpacesWithRechargePoint
            }
            rechargingAvailableValue={getRechargingAvailableValue(
              rechargingAvailable,
            )}
          />
          <TextField
            variant="standard"
            hintText={formatMessage({
              id: "parking_number_of_spaces_with_recharge_point",
            })}
            disabled={!rechargingAvailable || disabled || hasExpired}
            floatingLabelText={formatMessage({
              id: "parking_number_of_spaces_with_recharge_point",
            })}
            onChange={(_e, value) => {
              handleSetNumberOfSpacesWithRechargePoint(value);
            }}
            value={numberOfSpacesWithRechargePoint || ""}
            type="number"
            fullWidth
            className={classes.textField}
          />
        </Box>
      </Grid>
    </StyledGrid>
  );
};

export default injectIntl(ParkingItemPayAndRideExpandedFields);
