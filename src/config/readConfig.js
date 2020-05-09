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

import axios from 'axios';

/*
Reading config json as served out of the node application.
*/

var configreader = {};
var config = null;

configreader.readConfig = callback => {
  if (config && typeof config !== 'undefined') {
    callback(config);
    return;
  }

  axios({
    url: 'config.json',
    timeout: 2000,
    method: 'get',
    responseType: 'json',
  })
    .then(function(response) {
      config = response.data;
      callback(config);
    })
    .catch(function(response) {
      throw new Error('Could not read config: ' + response);
    });
};

export default configreader;
