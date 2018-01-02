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

import React  from 'react';
import PropTypes from 'prop-types';
import MdRemove from 'material-ui/svg-icons/action/delete';

const itemStyle = {
  flexBasis: '100%',
  textAlign: 'left',
  marginRight: 5
};

const TariffZonesItem = ({id, name, handleRemove}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: 5,
      justifyContent: 'space-between',
      lineHeight: 2
    }}
  >
    <div style={itemStyle}>{id}</div>
    <div style={itemStyle}>{name}</div>
    <div>
      <MdRemove
        style={{
          height: 16,
          width: 16,
          color: '#df544a',
          marginRight: 10,
          cursor: 'pointer'
        }}
        onClick={() => {
          handleRemove(id)
        }}
      />
    </div>
  </div>
);

TariffZonesItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleRemove: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default TariffZonesItem;
