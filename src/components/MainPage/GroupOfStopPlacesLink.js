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

import PropTypes from "prop-types";
import Routes from "../../routes/";

const GroupOfStopPlacesLink = ({ name, id, style }) => {
  const basename = import.meta.env.BASE_URL;
  const cleanBasename = basename === "/" ? "" : basename;
  const url = `${window.location.origin}${cleanBasename}/${Routes.GROUP_OF_STOP_PLACE}/${id}`;

  return (
    <a
      style={{ fontSize: "0.9em", ...style }}
      target="_blank"
      rel="noopener noreferrer"
      href={url}
    >
      {name}
    </a>
  );
};

GroupOfStopPlacesLink.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default GroupOfStopPlacesLink;
