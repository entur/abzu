import React from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const Loader = () => {
  const loadingStyle = {
    top: 200,
    height: 'auto',
    width: 380,
    margin: 20,
    position: 'absolute',
    zIndex: 2,
    padding: 10,
  };

  return (
    <div style={loadingStyle}>
      <RefreshIndicator size={50} left={70} top={0} status="loading" />
    </div>
  );
};

export default Loader;
