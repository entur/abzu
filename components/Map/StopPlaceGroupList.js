import React, {Component} from 'react';
import StopPlaceGroup from './StopPlaceGroup';
import { connect } from 'react-redux';

const StopPlaceGroupList = ({list}) => (
  list.map(({positions, name}, index) => (
    <StopPlaceGroup key={index} positions={positions} name={name}/>
  ))
);


const mapStateToProps = ({stopPlacesGroup}) => ({
  list: [({
    name: stopPlacesGroup.current.name,
    positions: [stopPlacesGroup.current.members.map(member => member.location)]
  })]
});

export default connect(mapStateToProps)(StopPlaceGroupList);
