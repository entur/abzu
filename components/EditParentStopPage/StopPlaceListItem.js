import React, { Component } from 'react';
import ModalityIcon from '../MainPage/ModalityIcon';
import Divider from 'material-ui/Divider';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import StopPlaceListItemDetails from './StopPlaceListItemDetails';

class StopPlaceListItem extends Component {

  getStopPlaceHref(stopPlaceId) {
    const path = window.location.href;
    const lastIndexOfSlash = path.lastIndexOf('/') +1;
    return path.substr(0,lastIndexOfSlash) + stopPlaceId;
  }

  render() {

    const { stopPlace, expanded, handleExpand, handleCollapse } = this.props;
    const stopPlaceHref = this.getStopPlaceHref(stopPlace.id);

    return (
      <div>
        <Divider />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 5,
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ModalityIcon
              type={stopPlace.stopPlaceType}
              submode={stopPlace.submode}
              forceUpdate={true}
              style={{ marginTop: -8 }}
            />
            <a
              style={{
                fontSize: '0.9em',
                color: 'rgb(33, 150, 243)',
              }}
              target="_blank"
              href={stopPlaceHref}
            >
              {stopPlace.id}
            </a>
          </div>
          <div style={{ marginRight: 5 }}>
            {expanded
              ? <NavigationExpandLess onClick={handleCollapse} />
              : <NavigationExpandMore onClick={handleExpand} />}
          </div>
        </div>
        {expanded && <StopPlaceListItemDetails stopPlace={stopPlace} />}
        <Divider />
      </div>
    );
  }
}

export default StopPlaceListItem;
