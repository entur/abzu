import { addLocaleData } from 'react-intl';
import axios from 'axios';

const localization = locale => {
  const localStorageKey = 'ABZU::settings::locale';

  return new Promise((resolve, reject) => {
    let preferredLocale = localStorage.getItem(localStorageKey) || locale;

    let queryParams = '';

    if (preferredLocale) {
      queryParams = '?locale=' + preferredLocale;
    }

    axios
      .get(window.config.endpointBase + 'translation.json' + queryParams)
      .then(({ data }) => {
        const locale = data.locale;
        const messages = JSON.parse(data.messages);

        var lang = require('react-intl/locale-data/' + locale);
        addLocaleData(lang);

        localStorage.setItem(localStorageKey, locale);

        resolve({ locale: locale, messages: messages });
      })
      .catch(response => {
        reject(response);
      });
  });
};

export default localization;
