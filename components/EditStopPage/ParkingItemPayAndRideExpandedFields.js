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
import parkingPaymentProcess from '../../models/parkingPaymentProcess';

const hasElements = a => a && a.length > 0;

const hasValue = v => v !== null && v !== undefined;

const getRechargingAvailableValue = v => hasValue(v) ? v : null;

const ParkingItemPayAndRideExpandedFields = (props) => {
  const {
    intl: { formatMessage },
    disabled,
    parking,
    handleSetParkingPaymentProcess,
    handleSetRechargingAvailable,
  } = props;

  const parkingPaymentProcessesMenuItems = parkingPaymentProcess.map(key => (
    <MenuItem
      insetChildren
      leftIcon={hasElements(parking.parkingPaymentProcess) && parking.parkingPaymentProcess.indexOf(key) > -1 ? <CheckIcon /> : null}
      key={key}
      value={key}
      primaryText={formatMessage({ id: `parking_payment_process_${key}` })} />
  ));

  const rechargingAvailableMenuItems = [true, false].map(key => (
    <MenuItem
      insetChildren
      leftIcon={hasValue(parking.rechargingAvailable) && getRechargingAvailableValue(parking.rechargingAvailable) === key ? <CheckIcon /> : null}
      key={`rechargingAvailable_${key}`}
      value={key}
      primaryText={`${key}`} />
  ));

  return (
    <div>
      <SelectField
        multiple
        disabled={disabled || parking.hasExpired}
        floatingLabelText={formatMessage({ id: 'parking_payment_process' })}
        value={hasElements(parking.parkingPaymentProcess) ? parking.parkingPaymentProcess.map(v => `${v}`) : null}
        onChange={(_e,_i,value) => {
          handleSetParkingPaymentProcess(value);
        }}>
          {parkingPaymentProcessesMenuItems}
      </SelectField>
      <SelectField
        disabled={disabled || parking.hasExpired}
        floatingLabelText="rechargingAvailable"
        value={getRechargingAvailableValue(parking.rechargingAvailable)}
        onChange={(_e,_i,value) => {
          handleSetRechargingAvailable(value);
        }}>
          {rechargingAvailableMenuItems}
      </SelectField>
    </div>
  );
}

export default injectIntl(ParkingItemPayAndRideExpandedFields);
