import React from 'react';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location';
import MdError from 'material-ui/svg-icons/alert/error';

const locationStyle = {
  marginRight: 5,
  height: 16,
  width: 16,
};

export default ({ translations, location, expanded, handleLocateOnMap, handleToggleCollapse, handleMissingCoordinatesClick, children }) => (
  <div className="tabItem">
    <div
      style={{
        float: 'flex',
        alignItems: 'center',
        width: '95%',
        marginTop: 10,
        padding: 3,
      }}
    >
      {location ? (
        <MapsMyLocation
          style={locationStyle}
          onClick={handleLocateOnMap} />
      ) : (
        <div
          className="tooltip"
          style={{ display: 'inline-block' }}
          title={translations.quayMissingLocation}>
            <span className="tooltipText"> </span>
            <MdError
              style={{ ...locationStyle, color: '#bb271c' }}
              onClick={handleMissingCoordinatesClick}
            />
        </div>
      )}
      <div
        style={{ display: 'inline-block'}}
        onClick={handleToggleCollapse}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {children}
        </div>
      </div>
    </div>
    {!expanded
      ? <NavigationExpandMore
          onClick={handleToggleCollapse}
          style={{ float: 'right', marginTop: '-25px' }}
        />
      : <NavigationExpandLess
          onClick={handleToggleCollapse}
          style={{ float: 'right', marginTop: '-25px' }}
        />}
  </div>
);
