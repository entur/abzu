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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { injectIntl } from 'react-intl';
import { parkingPaymentProcesses } from '../../models/parkingPaymentProcess';
import { parkingLayouts } from '../../models/parkingLayout';
import { TextField, Subheader } from 'material-ui';
import RechargingAvailablePopover from './RechargingAvailablePopover';
import LocalParking from 'material-ui/svg-icons/maps/local-parking';
import { ActionAccessible } from 'material-ui/svg-icons';
import Payment from 'material-ui/svg-icons/action/payment';
import Box from '@material-ui/core/Box';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  mainGrid: {
    marginTop: '.5rem'
  },
  gridItemMargin: {
    marginLeft: '55px'
  },
  boxFullWidth: {
    width: '100%'
  },
  textField: {
    marginTop: -10
  },
  selectInput: {
    width: '100%'
  },
  info: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '12px',
    paddingLeft: '16px',
    width: '100%',
    marginBlockStart: 0
  }
}));

const Info = ({children}) => {
  const classes = useStyles();
  return <p className={classes.info}>{children}</p>;
}

const parkingIconStyles = (topMargin = 15) => ({
  margin: `${topMargin}px 22px 18px 10px`
});

const hasElements = list => list && list.length > 0;

const hasValue = value => value !== null && value !== undefined;

const getRechargingAvailableValue = value => hasValue(value) ? value : null;

const parkingPaymentProcessSelectFieldValue = (parkingPaymentProcess) => {
  return hasElements(parkingPaymentProcess) ? parkingPaymentProcess.map(value => `${value}`) : [];
}

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

  const classes = useStyles();

  return (
    <Grid container alignItems="stretch" direction="column" spacing={2} className={classes.mainGrid}>
      <Grid item className={classes.gridItemMargin}>
        <InputLabel htmlFor="select-parking-layout">
          {formatMessage({ id: 'parking_layout'})}
        </InputLabel>
        <Select
          displayEmpty
          disabled={disabled || hasExpired}
          value={parkingLayout}
          input={<Input className={classes.selectInput} id="select-parking-layout" />}
          renderValue={selected => selected ? formatMessage({ id: `parking_layout_${selected}`}) : <em>{formatMessage({ id: 'parking_layout'})}</em>}
          onChange={(event) => {
            const { value } = event.target;
            handleSetParkingLayout(value);
          }}>
            {parkingLayouts.map(key => (
              <MenuItem key={key} value={key}>
                <Checkbox checked={key === parkingLayout} />
                <ListItemText
                  primary={formatMessage({ id: `parking_layout_${key}`})} />
              </MenuItem>
            ))}
        </Select>
      </Grid>
      <Grid item>
        <Box display="flex" flexDirection="row" className={classes.boxFullWidth}>
          <Box>
            <Payment style={parkingIconStyles(6)} />
          </Box>
          <Box className={classes.boxFullWidth}>
            <InputLabel htmlFor="select-multiple-parking-payment-process">
              {formatMessage({ id: 'parking_payment_process' })}
            </InputLabel>
            <Select
              multiple
              displayEmpty
              disabled={disabled || hasExpired}
              value={parkingPaymentProcessSelectFieldValue(parkingPaymentProcess)}
              renderValue={selected => {
                if (selected.length === 0) {
                  return <em>{formatMessage({ id: 'parking_payment_process' })}</em>;
                }

                return selected.map(key => {
                  return formatMessage({ id: `parking_payment_process_${key}` });
                }).join(', ');
              }}
              input={<Input className={classes.selectInput} id="select-multiple-parking-payment-process" />}
              onChange={(event) => {
                const { value } = event.target;
                handleSetParkingPaymentProcess(value);
              }}>
                {parkingPaymentProcesses.map(key => (
                  <MenuItem key={key} value={key}>
                    <Checkbox checked={hasElements(parkingPaymentProcess) && parkingPaymentProcess.indexOf(key) > -1} />
                    <ListItemText
                      primary={formatMessage({ id: `parking_payment_process_${key}` })}
                      secondary={key === `payByPrepaidToken` ? formatMessage({ id: `parking_payment_process_${key}_hover`}) : null } />
                  </MenuItem>
                ))}
            </Select>
          </Box>
        </Box>
      </Grid>
      <Grid item>
        <Subheader>{formatMessage({id: 'parking_parkAndRide_capacity_sub_header'})} ({`${totalCapacity}`})</Subheader>
        <Box display="flex" flexDirection="row" className={classes.boxFullWidth}>
          <LocalParking style={parkingIconStyles()} />
          <TextField
            disabled={disabled || hasExpired}
            floatingLabelText={formatMessage({ id: 'parking_number_of_spaces' })}
            onChange={(_e, value) => {
              handleSetNumberOfSpaces(value);
            }}
            value={numberOfSpaces || ''}
            type="number"
            fullWidth
            className={classes.textField} />
        </Box>
        <Box display="flex" flexDirection="row" className={classes.boxFullWidth}>
          <ActionAccessible style={parkingIconStyles()} />
          <TextField
            hintText={formatMessage({ id: 'parking_number_of_spaces_for_registered_disabled_user_type' })}
            disabled={disabled || hasExpired}
            floatingLabelText={formatMessage({ id: 'parking_number_of_spaces_for_registered_disabled_user_type' })}
            onChange={(e, value) => {
              handleSetNumberOfSpacesForRegisteredDisabledUserType(value);
            }}
            value={numberOfSpacesForRegisteredDisabledUserType || ''}
            type="number"
            fullWidth
            className={classes.textField} />
        </Box>
      </Grid>
      <Grid item>
        <Subheader>{formatMessage({id: 'parking_recharging_sub_header'})}</Subheader>
        <Info>
          {formatMessage({id: 'parking_recharging_available_info'})}
        </Info>
        <Box display="flex" flexDirection="row" className={classes.boxFullWidth}>
          <RechargingAvailablePopover
            disabled={disabled}
            hasExpired={hasExpired}
            handleSetRechargingAvailable={handleSetRechargingAvailable}
            handleSetNumberOfSpacesWithRechargePoint={handleSetNumberOfSpacesWithRechargePoint}
            rechargingAvailableValue={getRechargingAvailableValue(rechargingAvailable)} />
          <TextField
            hintText={formatMessage({ id: 'parking_number_of_spaces_with_recharge_point' })}
            disabled={!rechargingAvailable || disabled || hasExpired}
            floatingLabelText={formatMessage({ id: 'parking_number_of_spaces_with_recharge_point' })}
            onChange={(_e, value) => {
              handleSetNumberOfSpacesWithRechargePoint(value);
            }}
            value={numberOfSpacesWithRechargePoint || ''}
            type="number"
            fullWidth
            className={classes.textField} />
        </Box>
      </Grid>
    </Grid>
  );
}

export default injectIntl(ParkingItemPayAndRideExpandedFields);
