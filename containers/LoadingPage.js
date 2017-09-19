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
