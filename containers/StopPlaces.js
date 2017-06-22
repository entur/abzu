import React from 'react';
import SearchBox from './SearchBox';
import StopPlacesMap from './StopPlacesMap';
import '../styles/main.css';

const StopPlaces = () => {
  return (
    <div>
      <SearchBox />
      <StopPlacesMap />
    </div>
  );
};

export default StopPlaces;
