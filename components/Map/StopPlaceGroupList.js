import React, {Component} from 'react';
import StopPlaceGroup from './StopPlaceGroup';

const StopPlaceGroupList = ({list}) => (
  list.map(({positions, name}, index) => (
    <StopPlaceGroup key={index} positions={positions} name={name}/>
  ))
);

StopPlaceGroupList.defaultProps = {
  list: [
    {
      positions: [
        [63.436256, 10.399359],
        [63.432316, 10.407262],
        [63.433291, 10.39806]
      ],
      name: 'Group of Stop Place'
    }
  ]
};

export default StopPlaceGroupList;
