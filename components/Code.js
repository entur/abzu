import React from 'react';
import '../styles/Code.css';

const Code = ({ type, value }) => {
  // As a tribute to PHP
  let valueIsSet = isSet(value);

  return (
    <div className={type}>
      {valueIsSet
        ? <div style={{ marginTop: 2 }}>{value}</div>
        : <div style={{ marginTop: 4, fontSize: 8 }}>N/A</div>}
    </div>
  );
};

const isSet = type => {
  if (typeof type === 'undefined' || type === null) {
    return false;
  }

  if (typeof type === 'string') {
    return type.length > 0;
  }

  if (typeof type === 'number') {
    return true;
  }
  return false;
};

export default Code;
