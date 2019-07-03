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
import { injectIntl } from 'react-intl';

const ParkingItemExpandedFields = ({
  translations,
  disabled,
  parking,
  renderNameField,
  handleSetTotalCapacity
}) => (
    <div>
      {renderNameField()}
      <TextField
        hintText={translations.capacity}
        disabled={disabled || parking.hasExpired}
        floatingLabelText={translations.capacity}
        onChange={(e, v) => {
          handleSetTotalCapacity(v);
        }}
        value={parking.totalCapacity}
        type="number"
        style={{ width: '95%', marginTop: -10 }}
      />

    </div>
);

export default injectIntl(ParkingItemExpandedFields)
