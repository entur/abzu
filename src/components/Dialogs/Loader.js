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
import RefreshIndicator from 'material-ui/RefreshIndicator';

const Loader = () => {
  const loadingStyle = {
    position: 'absolute',
    zIndex: 9999,
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
