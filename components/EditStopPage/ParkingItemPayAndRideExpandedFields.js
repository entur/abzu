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
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { injectIntl } from 'react-intl';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import parkingPaymentProcessKeys from '../../models/parkingPaymentProcess';
import { TextField } from 'material-ui';

const hasElements = list => list && list.length > 0;

const hasValue = value => value !== null && value !== undefined;

const getRechargingAvailableValue = value => hasValue(value) ? value : null;

const parkingPaymentProcessCheckIcon = (key, parkingPaymentProcess) => {
  return hasElements(parkingPaymentProcess) && parkingPaymentProcess.indexOf(key) > -1 ? <CheckIcon /> : null;
}

const parkingPaymentProcessSelectFieldValue = (parkingPaymentProcess) => {
  return hasElements(parkingPaymentProcess) ? parkingPaymentProcess.map(value => `${value}`) : null;
}

const rechargingAvailableCheckIcon = (key, rechargingAvailable) => {
  return hasValue(rechargingAvailable) && getRechargingAvailableValue(rechargingAvailable) === key ? <CheckIcon /> : null;
}

const ParkingItemPayAndRideExpandedFields = (props) => {
  const {
    intl: { formatMessage },
    disabled,
    hasExpired,
    parkingPaymentProcess,
    rechargingAvailable,
    numberOfSpaces,
    numberOfSpacesWithRechargePoint,
    numberOfSpacesForRegisteredDisabledUserType,
    handleSetParkingPaymentProcess,
    handleSetRechargingAvailable,
    handleSetNumberOfSpaces,
    handleSetNumberOfSpacesWithRechargePoint,
    handleSetNumberOfSpacesForRegisteredDisabledUserType,
  } = props;

  const parkingPaymentProcessesMenuItems = parkingPaymentProcessKeys.map(key => (
    <MenuItem
      insetChildren
      leftIcon={parkingPaymentProcessCheckIcon(key, parkingPaymentProcess)}
      key={key}
      value={key}
      primaryText={formatMessage({ id: `parking_payment_process_${key}` })} />
  ));

  const rechargingAvailableMenuItems = [true, false].map(key => (
    <MenuItem
      insetChildren
      leftIcon={rechargingAvailableCheckIcon(key, rechargingAvailable)}
      key={`rechargingAvailable_${key}`}
      value={key}
      primaryText={formatMessage({ id: `parking_recharging_available_${key}`} )} />
  ));

  return (
    <div>
      <SelectField
        multiple
        disabled={disabled || hasExpired}
        floatingLabelText={formatMessage({ id: 'parking_payment_process' })}
        value={parkingPaymentProcessSelectFieldValue(parkingPaymentProcess)}
        onChange={(_e,_i,value) => {
          handleSetParkingPaymentProcess(value);
        }}>
          {parkingPaymentProcessesMenuItems}
      </SelectField>
      <TextField
        hintText="numberOfSpaces"
        disabled={disabled || hasExpired}
        floatingLabelText="numberOfSpaces"
        onChange={(_e, value) => {
          handleSetNumberOfSpaces(value);
        }}
        value={numberOfSpaces}
        type="number"
        style={{ width: '95%', marginTop: -10 }} />
      <SelectField
        disabled={disabled || hasExpired}
        floatingLabelText={formatMessage({ id: 'parking_recharging_available' })}
        value={getRechargingAvailableValue(rechargingAvailable)}
        onChange={(_e,_i,value) => {
          handleSetRechargingAvailable(value);
        }}>
          {rechargingAvailableMenuItems}
      </SelectField>
      {getRechargingAvailableValue(rechargingAvailable && (
        <TextField
          hintText="numberOfSpacesWithRechargePoint"
          disabled={disabled || hasExpired}
          floatingLabelText="numberOfSpacesWithRechargePoint"
          onChange={(_e, value) => {
            handleSetNumberOfSpacesWithRechargePoint(value);
          }}
          value={numberOfSpacesWithRechargePoint}
          type="number"
          style={{ width: '95%', marginTop: -10 }} />
      ))}

      <TextField
        hintText="numberOfSpaces registeredDisabled"
        disabled={disabled || hasExpired}
        floatingLabelText="numberOfSpaces registeredDisabled"
        onChange={(e, value) => {
          handleSetNumberOfSpacesForRegisteredDisabledUserType(value);
        }}
        value={numberOfSpacesForRegisteredDisabledUserType}
        type="number"
        style={{ width: '95%', marginTop: -10 }} />
    </div>
  );
}

export default injectIntl(ParkingItemPayAndRideExpandedFields);
