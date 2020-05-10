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

import { addLocaleData } from "react-intl";
import axios from "axios";

const localization = (locale) => {
  const localStorageKey = "ABZU::settings::locale";

  return new Promise((resolve, reject) => {
    let preferredLocale = locale || localStorage.getItem(localStorageKey);

    let queryParams = "";

    if (preferredLocale) {
      queryParams = "?locale=" + preferredLocale;
    }

    axios
      .get(window.config.endpointBase + "translation.json" + queryParams)
      .then(({ data }) => {
        const locale = data.locale;
        const messages = JSON.parse(data.messages);

        var lang = require("react-intl/locale-data/" + locale);
        addLocaleData(lang);

        localStorage.setItem(localStorageKey, locale);

        resolve({ locale, messages });
      })
      .catch((response) => {
        reject(response);
      });
  });
};

export default localization;
