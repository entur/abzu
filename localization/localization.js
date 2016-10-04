import { addLocaleData } from 'react-intl'
import axios from 'axios'

const localization = (config) => {

  const localStorageKey = '__stop_place__'

  return new Promise( (resolve, reject) => {

    let storedLocalization = localStorage.getItem(localStorageKey)
    let queryParams = ''

    if (storedLocalization) {
      queryParams = '?locale=' + storedLocalization
    }

    axios.get(config.endpointBase + 'translation.json' + queryParams).then(({ data }) => {

      const locale = data.locale
      const messages = JSON.parse(data.messages)

      var lang = require('react-intl/locale-data/' + locale)
      addLocaleData(lang)

      localStorage.setItem(localStorageKey, locale)

      resolve({locale: locale, messages: messages})

    })
    .catch( (response) => {
      reject(response)
   })
  })
}

export default localization
