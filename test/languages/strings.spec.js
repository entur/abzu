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


import nb_lang from '../../static/lang/nb.json';
import en_lang from '../../static/lang/en.json';
import fr_lang from '../../static/lang/fr.json';

describe('language support', () => {

  test('should support translations for all strings in all languages', () => {

    const norwegianKeys = Object.keys(nb_lang).sort()
    const englishKeys = Object.keys(en_lang).sort()
    const frenchKeys = Object.keys(fr_lang).sort()

    let notInEnglish = norwegianKeys.filter(key => englishKeys.indexOf(key) === -1)
    let notInNorwegian = englishKeys.filter(key => norwegianKeys.indexOf(key) === -1)
    let notInFrench = norwegianKeys.filter(key => frenchKeys.indexOf(key) === -1)

    if (notInEnglish.length) {
      console.info("Keys found in Norwegian not present in English: ", notInEnglish.join(','))
    }

    if (notInNorwegian.length) {
      console.info("Keys found in English not present in Norwegian: ", notInNorwegian.join(','))
    }

    if (notInFrench.length) {
      console.info("Keys found in Norwegian not present in French: ", notInFrench.join(','))
    }

    expect(JSON.stringify(norwegianKeys)).toEqual(JSON.stringify(englishKeys))
    expect(JSON.stringify(norwegianKeys)).toEqual(JSON.stringify(frenchKeys))

  })

})
