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
        <div style={{ display: 'flex', alignItems: 'center', padding: 5}}>
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
