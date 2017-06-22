import React from 'react';
import icon from '../static/icons/compass.png';

const CompassBearingInfo = ({value}) => {
  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <img
        style={{height: 20, width: 20, marginLeft: 10, marginRight: 5}}
        src={icon}/>
      { getProperValue(value) }
    </div>
  )
};

const getProperValue = value => {
  if (typeof value === 'number') {
    return <span>{value}<em>&deg;</em></span>
  }
  return <span style={{fontSize: 12}}>N/A</span>;
}

export default CompassBearingInfo;