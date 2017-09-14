import React from 'react';
import ModalityIcon from './ModalityIcon';
import MenuItem from 'material-ui/MenuItem';
import ModalityIconTray from '../ReportPage/ModalityIconTray';

export const createSearchMenuItem = element => {
  if (element.isParent) {
    return createParentStopPlaceMenuItem(element);
  }
  return createStopPlaceMenuItem(element);
};

const createParentStopPlaceMenuItem = element => {
  return {
    element: element,
    text: element.name,
    value: (
      <MenuItem
        style={{ marginTop: 0, width: 'auto' }}
        key={element.id}
        innerDivStyle={{ padding: '0px 16px 0px 0px' }}
        primaryText={
          <div style={{display: 'flex'}}>
            <div style={{marginLeft: 10, display: 'flex', flexDirection: 'column', minWidth: 280}}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.9em' }}>{element.name}<span style={{fontWeight: 600, fontSize: '0.7em', marginLeft: 5}}>MM</span></div>
                <div style={{ fontSize: '0.6em', color: 'grey' }}>{element.id}</div>
              </div>
              <div
                style={{ color: 'grey', marginTop: -20, marginBottom: -10, fontSize: '0.7em' }}
              >{`${element.topographicPlace}, ${element.parentTopographicPlace}`}
              </div>
            </div>
            <ModalityIconTray
              style={{marginLeft: 7, display: 'flex', flexDirection: 'column'}}
              modalities={element.children.map(child => ({
                submode: child.submode,
                stopPlaceType: child.stopPlaceType
              }))}
            />
          </div>
        }
      />
    )
  };
};

const createStopPlaceMenuItem = element => {
  return {
    element: element,
    text: element.name,
    value: (
      <MenuItem
        style={{ marginTop: 0, width: 'auto' }}
        key={element.id}
        innerDivStyle={{ padding: '0px 16px 0px 0px' }}
        primaryText={
          <div style={{marginLeft: 10, display: 'flex', flexDirection: 'column', minWidth: 280}}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.9em' }}>{element.name}</div>
              <div style={{ fontSize: '0.6em', color: 'grey' }}>{element.id}</div>
            </div>
            <div
              style={{ color: 'grey', marginTop: -20, marginBottom: -10, fontSize: '0.7em' }}
            >{`${element.topographicPlace}, ${element.parentTopographicPlace}`}
            </div>
          </div>
        }
        rightIcon={
          <ModalityIcon
            svgStyle={{ marginTop: 10, marginRight: 0 }}
            style={{ display: 'inline-block', position: 'relative' }}
            iconStyle={{
              float: 'right',
              transform: 'translateY(2px) scale(0.8)'
            }}
            type={element.stopPlaceType}
            submode={element.submode}
          />
        }
      />
    )
  };
};
