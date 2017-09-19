/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

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
