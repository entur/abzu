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

import { getEnvironment } from "./getEnvironment";
const globalConfig = require("./global.json").default;

const config = {
  dev: require("./environments/dev.json").default,
  "nordic-dev": require("./environments/nordic-dev.json").default,
  test: require("./environments/test.json").default,
  prod: require("./environments/prod.json").default,
};

var configreader = {};

configreader.readConfig = (callback) => {
  const env = getEnvironment();
  callback(Object.assign({}, globalConfig, config[env]));
};

export default configreader;
