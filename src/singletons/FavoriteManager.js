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

let instance = null;
const key = "ABZU::favorites";

class FavoriteManager {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  getFavorites() {
    return this._loadLocalFavorites();
  }

  saveFavorites(favorites) {
    localStorage.setItem(key, JSON.stringify(favorites));
  }

  isFavoriteAlreadyStored(savableContent) {
    let favorites = this.getFavorites();

    for (let i = 0; i < favorites.length; i++) {
      if (
        JSON.stringify(this.createComparable(favorites[i])) ===
        JSON.stringify(this.createComparable(savableContent))
      ) {
        return true;
      }
    }

    return false;
  }

  createSavableContent(
    title,
    searchText,
    stopType,
    topoiChips,
    showFutureAndExpired
  ) {
    return {
      stopType,
      topoiChips,
      searchText,
      title,
      showFutureAndExpired,
    };
  }

  createComparable(content) {
    return {
      searchText: content.searchText,
      stopType: content.stopType,
      topoiChips: content.topoiChips,
      showFutureAndExpired: content.showFutureAndExpired,
    };
  }

  remove(content) {
    let favorites = this.getFavorites();

    for (let i = 0; i < favorites.length; i++) {
      let favoriteContent = this.createComparable(favorites[i]);
      let contentToRemove = this.createComparable(content);

      if (JSON.stringify(favoriteContent) === JSON.stringify(contentToRemove)) {
        favorites.splice(i, 1);
      }
    }
    this.saveFavorites(favorites);
  }

  save(content) {
    try {
      if (!this.isFavoriteAlreadyStored(content)) {
        let favorites = this.getFavorites();
        favorites.push(content);
        this.saveFavorites(favorites);
      }
    } catch (e) {
      console.error("error saving content in localStorage", e);
    }
  }

  _loadLocalFavorites() {
    try {
      if (localStorage.getItem(key) !== null) {
        let localFavorites = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(localFavorites)) return localFavorites;
      }

      return [];
    } catch (e) {
      console.error(
        "Invalid data in localStorage for key",
        key,
        "returning []"
      );
      localStorage.removeItem(key);
      return [];
    }
  }
}

export default FavoriteManager;
