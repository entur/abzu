let instance = null
const key = '__favorites__'

class FavoriteManager {

  constructor() {

    if (!instance) {
      instance = this
    }
    return instance
  }

  getFavorites() {
    return this._loadLocalFavorites()
  }

  saveFavorites(favorites) {
    localStorage.setItem(key, JSON.stringify(favorites))
  }

  isFavoriteAlreadyStored(savableContent) {

    let favorites = this.getFavorites()

    for (let i = 0; i < favorites.length; i++) {

      if (JSON.stringify(this.createComparable(favorites[i]))
          === JSON.stringify(this.createComparable(savableContent))) {
        return true
      }
    }

    return false
  }

  createSavableContent(title, searchText, stopType, topoiChips) {
    return {
      stopType: stopType,
      topoiChips: topoiChips,
      searchText: searchText,
      title: title
    }
  }

  createComparable(content) {
    return {
      searchText: content.searchText,
      stopType: content.stopType,
      topoiChips: content.topoiChips
    }
  }

  remove(content) {
    let favorites = this.getFavorites()

    for (let i = 0; i < favorites.length; i++) {
      let favoriteContent = this.createComparable(favorites[i])
      let contentToRemove = this.createComparable(content)

      if (JSON.stringify(favoriteContent)
        === JSON.stringify(contentToRemove)) {
        favorites.splice(i,1)
      }
    }
    this.saveFavorites(favorites)
  }

  save(content) {

    try {

      if (!this.isFavoriteAlreadyStored(content)) {
        let favorites = this.getFavorites()
        favorites.push(content)
        this.saveFavorites(favorites)
      }

    } catch (e) {
      console.error('error saving content in localStorage', e)
    }
  }

  _loadLocalFavorites() {

    try {

      if (localStorage.getItem(key) !== null ) {
          let localFavorites = JSON.parse(localStorage.getItem(key))
          if (Array.isArray(localFavorites)) return localFavorites
      }

      return []

    } catch (e) {
      console.error('Invalid data in localStorage for key', key, 'returning []')
      localStorage.removeItem(key)
      return []
    }
  }
}

export default FavoriteManager
