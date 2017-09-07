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
        style={{ marginTop: 3, paddingRight: 5, width: 'auto' }}
        key={element.id}
        innerDivStyle={{ minWidth: 300, padding: '0px 16px 0px 0px' }}
        primaryText={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ModalityIconTray
                style={{marginLeft: 15, display: 'flex', flexDirection: 'column'}}
                modalities={element.children.map(child => ({
                  submode: child.submode,
                  stopPlaceType: child.stopPlaceType
                }))}
              />
              <div style={{ fontSize: '0.9em' }}>{element.name}</div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                color: 'grey',
                fontSize: '0.7em',
                justifyContent: 'space-between'
              }}
            >
              <div
                style={{ marginBottom: 0 }}
              >{`${element.topographicPlace}, ${element.parentTopographicPlace}`}</div>
              <div style={{ marginTop: -30 }}>{element.id}</div>
            </div>
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
        innerDivStyle={{ minWidth: 300, padding: '0px 16px 0px 0px' }}
        primaryText={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.9em' }}>{element.name}</div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                color: 'grey',
                fontSize: '0.7em',
                justifyContent: 'space-between'
              }}
            >
              <div
                style={{ marginBottom: 0 }}
              >{`${element.topographicPlace}, ${element.parentTopographicPlace}`}</div>
              <div style={{ marginTop: -30 }}>{element.id}</div>
            </div>
          </div>
        }
        leftIcon={
          <ModalityIcon
            svgStyle={{ marginRight: 10, marginTop: 10 }}
            style={{ display: 'inline-block', position: 'relative' }}
            type={element.stopPlaceType}
            submode={element.submode}
          />
        }
      />
    )
  };
};
