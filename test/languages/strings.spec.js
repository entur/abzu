import expect from 'expect'
import nb_lang from '../../static/lang/nb.json'
import en_lang from '../../static/lang/en.json'

describe('language support', () => {

  it('should support translations for all languages', () => {

    const norwegianKeys = Object.keys(nb_lang).sort()
    const englishKeys = Object.keys(en_lang).sort()

    expect(JSON.stringify(norwegianKeys)).toEqual(JSON.stringify(englishKeys))

  })


})
