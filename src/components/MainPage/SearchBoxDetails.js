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

import { Entities } from "../../models/Entities";
import GroupResultInfo from "./GroupResultInfo";
import ParentStopPlaceResultInfo from "./ParentStopPlaceResultInfo";
import SearchBoxEdit from "./SearchBoxEditActions";
import SearchBoxGeoWarning from "./SearchBoxGeoWarning";
import SearchBoxUsingTempGeo from "./SearchBoxUsingTempGeo";
import StopPlaceResultInfo from "./StopPlaceResultInfo";

const SearchBoxDetails = ({
  text,
  result,
  handleEdit,
  formatMessage,
  handleChangeCoordinates,
  userSuppliedCoordinates,
  canEdit,
}) => {
  const style = {
    background: "#fefefe",
    border: "1px dotted #add8e6",
    padding: 5,
  };

  const { entityType } = result;

  let ResultInfo = null;

  if (entityType === Entities.STOP_PLACE) {
    if (result.isParent) {
      ResultInfo = (
        <ParentStopPlaceResultInfo
          result={result}
          formatMessage={formatMessage}
        />
      );
    } else {
      ResultInfo = (
        <StopPlaceResultInfo result={result} formatMessage={formatMessage} />
      );
    }
  } else if (entityType === Entities.GROUP_OF_STOP_PLACE) {
    ResultInfo = (
      <GroupResultInfo result={result} formatMessage={formatMessage} />
    );
  }

  return (
    <div style={style}>
      {ResultInfo}
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
