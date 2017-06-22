import React from 'react';
import '../styles/Code.css';

const Code = ({type, value}) => {
  return (
    <div className={type}>
      {value || 'N/A'}
    </div>
  );
};

export default Code;