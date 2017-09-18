import React from 'react';
import ModalityIcon from './ModalityIcon';
import MenuItem from 'material-ui/MenuItem';
import ModalityIconTray from '../ReportPage/ModalityIconTray';
import { hasExpired, isFuture } from '../../modelUtils/validBetween';

export const createSearchMenuItem = (element, formatMessage) => {
  if (element.isParent) {
    return createParentStopPlaceMenuItem(element, formatMessage);
  }
  return createStopPlaceMenuItem(element, formatMessage);
};

const getFutureOrExpiredLabel = stopPlace => {
  if (hasExpired(stopPlace.validBetween)) {
    return 'search_result_expired';
  }
  if (isFuture(stopPlace.validBetween)) {
    return 'search_result_future';
  }
  return null;
};

const createParentStopPlaceMenuItem = (element, formatMessage) => {
  const futureOrExpiredLabel = getFutureOrExpiredLabel(element);
  return {
    element: element,
    text: element.name,
    value: (
      <MenuItem
        style={{ marginTop: 0, width: 'auto' }}
        key={element.id}
        innerDivStyle={{ padding: '0px 16px 0px 0px' }}
        primaryText={
          <div style={{ display: 'flex' }}>
            <div
              style={{
                marginLeft: 10,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 280
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.9em' }}>
                  {element.name}
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: '0.7em',
                      marginLeft: 5
                    }}
                  >
                    MM
                  </span>
                </div>
                <div style={{ fontSize: '0.6em', color: 'grey' }}>
                  {element.id}
                </div>
              </div>
              <div
                style={{
                  color: 'grey',
                  marginTop: -20,
                  marginBottom: -10,
                  fontSize: '0.7em',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <div
                >{`${element.topographicPlace}, ${element.parentTopographicPlace}`}</div>
                {futureOrExpiredLabel &&
                  <div key={'valid-label' + element.id} style={{marginRight: 5}}>
                    {formatMessage({ id: futureOrExpiredLabel})}
                  </div>}
              </div>
            </div>
            <ModalityIconTray
              style={{
                marginLeft: 7,
                display: 'flex',
                flexDirection: 'column'
              }}
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

const createStopPlaceMenuItem = (element, formatMessage) => {
  const futureOrExpiredLabel = getFutureOrExpiredLabel(element);
  return {
    element: element,
    text: element.name,
    value: (
      <MenuItem
        style={{ marginTop: 0, width: 'auto' }}
        key={element.id}
        innerDivStyle={{ padding: '0px 16px 0px 0px' }}
        primaryText={
          <div
            style={{
              marginLeft: 10,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 280
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.9em' }}>{element.name}</div>
              <div style={{ fontSize: '0.6em', color: 'grey' }}>
                {element.id}
              </div>
            </div>
            <div
              style={{
                color: 'grey',
                marginTop: -20,
                marginBottom: -10,
                fontSize: '0.7em',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <div
              >{`${element.topographicPlace}, ${element.parentTopographicPlace}`}</div>
              {futureOrExpiredLabel &&
                <div key={'valid-label' + element.id} style={{marginRight: 5}}>
                  {formatMessage({ id: futureOrExpiredLabel})}
                </div>}
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
