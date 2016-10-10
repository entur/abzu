let instance = null

class FavoriteManager {

  constructor() {
    if (!instance) {
      instance = this
      this.favorites = []
    }
    return instance
  }

  getFavorites() {
    return this.favorites
  }

  save(key, content) {

    try {

      var contentToSave = []

      if (localStorage.getItem(key) !== null) {

        var exisitingContent = JSON.parse(localStorage.getItem(key))

        // TODO : Check if content already is saved

        exisitingContent.push(content)
        contentToSave = exisitingContent

      } else {
        contentToSave.push(content)
      }

      localStorage.setItem(key, JSON.stringify(contentToSave))
      console.info("favorite saved in localStorage")

    } catch (e) {
      console.error('error saving content in localStorage', e)
    }


  }
}

const isArray = (obj) => {
  return !!obj && Array === obj.constructor
}

export default FavoriteManager
