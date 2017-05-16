import expect from 'expect'
import nb_lang from '../../static/lang/nb.json'
import en_lang from '../../static/lang/en.json'

describe('language support', () => {

  it('should support translations for all strings in all languages', () => {

    const norwegianKeys = Object.keys(nb_lang).sort()
    const englishKeys = Object.keys(en_lang).sort()

    let notInEnglish = norwegianKeys.filter( key => englishKeys.indexOf(key) === -1)
    let notInNorwegian = englishKeys.filter( key => norwegianKeys.indexOf(key) === -1)

    if (notInEnglish.length) {
      console.info("Keys found in Norwegian not present in English: ", notInEnglish.join(','))
    }

    if (notInNorwegian.length) {
      console.info("Keys found in English not present in Norwegian: ", notInNorwegian.join(','))
    }

    expect(JSON.stringify(norwegianKeys)).toEqual(JSON.stringify(englishKeys))

  })

})
