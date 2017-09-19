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
import QuayDetails from './QuayDetails';

class MergeQuaysDetails extends React.Component {

  render() {

    const { merginQuays } = this.props;

    if (!merginQuays) return null;

    return (
      <div style={{color: '#000', padding: 10, display: 'flex', justifyContent: 'space-between', marginBottom: 5}}>
          <QuayDetails
            key="from_quay"
            isSource={true}
            quay={merginQuays.fromQuay}
          />
        =>
        <QuayDetails
          key="to_quay"
          quay={merginQuays.toQuay}
          isSource={false}
        />
      </div>
    )
  }
}

export default MergeQuaysDetails;
