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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import Divider from 'material-ui/Divider';
import Code from '../EditStopPage/Code';

class StopPlaceListItemQuayItem extends Component {
  render() {

    const { expanded, handleExpand, handleCollapse, quay } = this.props;

    return (
      <div>
        <Divider />
        <div style={{ display: 'flex', alignItems: 'center', padding: 8}}>
          <Code type="publicCode" value={quay.publicCode} />
          <Code type="privateCode" value={quay.privateCode} />
          <div style={{display: 'flex', alignItems: 'center', marginLeft: 5}}>
            <div style={{ fontSize: '0.7em' }}>{quay.id}</div>
          </div>
        </div>
        <Divider />
      </div>
    );
  }
}

StopPlaceListItemQuayItem.propTypes = {
  expanded: PropTypes.bool.isRequired,
  handleExpand: PropTypes.func.isRequired,
  handleCollapse: PropTypes.func.isRequired
};

export default StopPlaceListItemQuayItem;
