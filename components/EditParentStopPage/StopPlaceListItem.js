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

import React, { Component } from 'react';
import ModalityIconImg from '../MainPage/ModalityIconImg';
import Divider from 'material-ui/Divider';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import EditorInsertLink from 'material-ui/svg-icons/editor/insert-link';
import StopPlaceListItemDetails from './StopPlaceListItemDetails';
import StopPlaceLink from '../ReportPage/StopPlaceLink';
import ModalityIconTray from '../ReportPage/ModalityIconTray';

class StopPlaceListItem extends Component {
  render() {
    const {
      stopPlace,
      expanded,
      handleExpand,
      handleCollapse,
      disabled,
      handleRemoveStopPlace,
      handleRemoveAdjacentConnection
    } = this.props;

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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {stopPlace.isParent
                ? <ModalityIconTray
                    modalities={stopPlace.children.map(child => ({
                      stopPlaceType: child.stopPlaceType,
                      submode: child.submode
                    }))}
                    style={{ marginTop: -8 }}
                  />
                : <ModalityIconImg
                    type={stopPlace.stopPlaceType}
                    submode={stopPlace.submode}
                    svgStyle={{ transform: 'scale(0.8)' }}
                    style={{ marginTop: -8, marginRight: 5 }}
                  />}
              {stopPlace.adjacentSites &&
                stopPlace.adjacentSites.length > 0 &&
                 <EditorInsertLink
                    style={{ marginLeft: -15, marginTop: -15, marginRight: 5, transform: 'scale(0.6)' }}
                  />
              }
              <div style={{ fontSize: '0.8em' }}>{stopPlace.name}</div>
            </div>
            <StopPlaceLink
              style={{ fontSize: '0.8em', marginRight: 5 }}
              id={stopPlace.id}
            />
          </div>
          <div style={{ marginRight: 5 }}>
            {expanded
              ? <NavigationExpandLess onClick={handleCollapse} />
              : <NavigationExpandMore onClick={handleExpand} />}
          </div>
        </div>
        {expanded &&
          <StopPlaceListItemDetails
            handleRemoveStopPlace={handleRemoveStopPlace}
            handleRemoveAdjacentConnection={handleRemoveAdjacentConnection}
            stopPlace={stopPlace}
            disabled={disabled}
          />}
        <Divider />
      </div>
    );
  }
}

export default StopPlaceListItem;
