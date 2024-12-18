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

import { FeatureGroup } from "react-leaflet";
import { connect } from "react-redux";
import { Entities } from "../../models/Entities";
import StopPlaceGroup from "./StopPlaceGroup";

const StopPlaceGroupList = ({ list }) => (
  <FeatureGroup>
    {list.map(({ positions, name }, index) => (
      <StopPlaceGroup key={index} positions={positions} name={name} />
    ))}
  </FeatureGroup>
);

const getSearchPolygon = (result) => {
  if (
    !result ||
    result.entityType !== Entities.GROUP_OF_STOP_PLACE ||
    !result.members.length
  ) {
    return null;
  }

  return {
    name: result.name,
    positions: [result.members.map((member) => member.location)],
  };
};

const mapStateToProps = ({ stopPlace, stopPlacesGroup }) => {
  let polygons = [];

  if (stopPlacesGroup.current.members.length) {
    polygons.push({
      name: stopPlacesGroup.current.name,
      positions: [
        stopPlacesGroup.current.members.map((member) => member.location),
      ],
    });
  }

  const searchPolygon = getSearchPolygon(stopPlace.activeSearchResult);

  if (searchPolygon) {
    polygons = polygons.concat(searchPolygon);
  }

  return {
    list: polygons,
  };
};

export default connect(mapStateToProps)(StopPlaceGroupList);
