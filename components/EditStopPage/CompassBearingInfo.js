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
import icon from '../../static/icons/compass.png';

const CompassBearingInfo = ({value}, {defaultValue}) => {
  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <img
        style={{height: 20, width: 20, marginLeft: 10, marginRight: 5}}
        src={icon}/>
      { getProperValue(value, defaultValue) }
    </div>
  )
};

const getProperValue = (value, defaultValue) => {
  if (typeof value === 'number') {
    return <span>{value}<em>&deg;</em></span>
  }
  return <span style={{fontSize: 12}}>{defaultValue}</span>;
}

export default CompassBearingInfo;
