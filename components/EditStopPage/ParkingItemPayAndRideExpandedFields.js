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
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { injectIntl } from 'react-intl';

const parkingPaymentProcesses = [
  'free',
  'payAndDisplay',
  'payByPrepaidToken',
  'payByMobileDevice'
];

class ParkingItemPayAndRideExpandedFields extends React.Component {
  render() {
    const {
      intl: { formatMessage },
      translations,
      disabled,
      parking,
      handleSetParkingPaymentProcess,
      renderNameField,
    } = this.props;

    const menuItems = parkingPaymentProcesses.map(key => (
      <MenuItem
        insetChildren
        key={key}
        value={key}
        primaryText={formatMessage({ id: `parking_payment_process_${key}` })} />
    ));

    return (
      <div>
        <SelectField
          multiple
          disabled={disabled || parking.hasExpired}
          floatingLabelText={formatMessage({ id: 'parking_payment_process' })}
          value={parking.parkingPaymentProcess.map(v => `${v}`)}
          onChange={(e,i,v) => {
            handleSetParkingPaymentProcess(v);
          }}>
            {menuItems}
        </SelectField>
        {renderNameField()}
        <TextField
          hintText={translations.capacity}
          disabled
          floatingLabelText={translations.capacity}
          value={parking.totalCapacity}
          type="number"
          style={{ width: '95%', marginTop: -10 }}
        />
      </div>
    );
  }
}

export default injectIntl(ParkingItemPayAndRideExpandedFields);
