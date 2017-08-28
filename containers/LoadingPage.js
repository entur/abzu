import React from 'react';
import Loader from '../components/Dialogs/Loader';

class LoadingPage extends React.Component {
  render() {
    return (
      <div style={{ height: '100%', width: '100%', background: '#aaaaaa'}}>
        <Loader />
      </div>
    );
  }
}

export default LoadingPage;
