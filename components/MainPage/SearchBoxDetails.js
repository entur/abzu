import React from 'react';
import SearchBoxEdit from './SearchBoxEditActions';
import SearchBoxUsingTempGeo from './SearchBoxUsingTempGeo';
import SearchBoxGeoWarning from './SearchBoxGeoWarning';
import StopPlaceResultInfo from './StopPlaceResultInfo';
import ParentStopPlaceResultInfo from './ParentStopPlaceResultInfo';

const SearchBoxDetails = ({
  text,
  result,
  handleEdit,
  formatMessage,
  handleChangeCoordinates,
  userSuppliedCoordinates,
  canEdit
}) => {
  const style = {
    background: '#fefefe',
    border: '1px dotted #add8e6',
    padding: 5
  };

  const { isParent } = result;

  return (
    <div style={style}>
      {isParent
        ? <ParentStopPlaceResultInfo
            result={result}
            formatMessage={formatMessage}
          />
        : <StopPlaceResultInfo result={result} formatMessage={formatMessage} />}
      <SearchBoxGeoWarning
        userSuppliedCoordinates={userSuppliedCoordinates}
        result={result}
        handleChangeCoordinates={handleChangeCoordinates}
      />
      <SearchBoxUsingTempGeo
        userSuppliedCoordinates={userSuppliedCoordinates}
        result={result}
        handleChangeCoordinates={handleChangeCoordinates}
      />
      <SearchBoxEdit
        canEdit={canEdit}
        handleEdit={handleEdit}
        text={text}
        result={result}
      />
    </div>
  );
};

export default SearchBoxDetails;
