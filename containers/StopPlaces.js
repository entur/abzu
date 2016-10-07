import React, { Component } from 'react'
import SearchBox from './SearchBox'
import StopPlacesMap from './StopPlacesMap'
require('../styles/main.css')

export default class StopPlaces extends React.Component {

  render() {
    return (
      <div>
        <SearchBox/>
        <StopPlacesMap/>
      </div>
    )
  }
}
