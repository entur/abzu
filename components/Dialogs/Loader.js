import React from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const Loader = () => {
  const loadingStyle = {
    position: 'absolute',
    zIndex: 2,
    marginLeft: '45vw',
    marginTop: '42vh'
  };

  return (
    <div style={loadingStyle}>
      <RefreshIndicator size={70} left={0} top={0} status="loading" />
    </div>
  );
};

export default Loader;
