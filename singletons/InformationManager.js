let instance = null
const key = 'rutebanken_pathlinks'

class InformationManager {

  constructor() {
    if (!instance) {
      instance = this
    }
    return instance
  }

  getShouldPathLinkBeDisplayed() {
    try {
      if (localStorage.getItem(key) !== null) {
        return JSON.parse(localStorage.getItem(key)).shouldBeDisplayed
      }
      return true
    } catch (e) {
      console.error('Unable to fetch information from localStorage', e)
    }
  }

  setShouldPathLinkBeDisplayed(shouldBeDisplayed) {
    try {
      localStorage.setItem(key, JSON.stringify({
        shouldBeDisplayed: shouldBeDisplayed
      }))

    } catch (e) {
      console.error('Unable to update information to localStorage', e)
    }
  }
}

export default InformationManager

