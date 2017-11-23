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

import StopPlace from "./StopPlace";
import ParentStopPlace from "./ParentStopPlace";

class GroupOfStopPlace {
  constructor(data) {
    this.data = data;
  }

  toClient() {
    try {
      const { data } = this;

      let clientGroup = {
        id: data.id,
        name: data.name ? data.name.value : "",
        description: data.description ? data.description.value : "",
        members: data.members.map(member => {
          const isParent = member["__typename"] === "ParentStopPlace";
          if (isParent) {
            return new ParentStopPlace(member, true).toClient();
          } else {
            return new StopPlace(member, true).toClient();
          }
        })
      };

      return clientGroup;
    } catch (e) {
      console.log("error", e);
    }
  }
}

export default GroupOfStopPlace;
