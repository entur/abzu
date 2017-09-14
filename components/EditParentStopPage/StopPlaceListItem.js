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

    const { stopPlace, expanded, handleExpand, handleCollapse, disabled} = this.props;
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
              svgStyle={{transform: 'scale(0.8)'}}
              style={{ marginTop: -8, marginRight: 5 }}
            />
            <a
              style={{
                fontSize: '0.8em',
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
        {expanded && <StopPlaceListItemDetails stopPlace={stopPlace} disabled={disabled} />}
        <Divider />
      </div>
    );
  }
}

export default StopPlaceListItem;
