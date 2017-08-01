import React from 'react';
import SearchBox from '../components/MainPage/SearchBox';
import StopPlacesMap from '../components/Map/StopPlacesMap';
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
