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

export interface FavoriteStopPlace {
  id: string;
  name: string;
  stopPlaceType?: string;
  submode?: string;
  entityType: string;
  isParent?: boolean;
  topographicPlace?: string;
  parentTopographicPlace?: string;
  location?: [number, number];
  addedAt: string;
}

const STORAGE_KEY = "abzu_favorite_stop_places";

export class FavoriteStopPlacesManager {
  private static instance: FavoriteStopPlacesManager;

  private constructor() {}

  public static getInstance(): FavoriteStopPlacesManager {
    if (!FavoriteStopPlacesManager.instance) {
      FavoriteStopPlacesManager.instance = new FavoriteStopPlacesManager();
    }
    return FavoriteStopPlacesManager.instance;
  }

  public getFavorites(): FavoriteStopPlace[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn("Failed to load favorite stop places:", error);
      return [];
    }
  }

  public addFavorite(stopPlace: Omit<FavoriteStopPlace, "addedAt">): void {
    try {
      const favorites = this.getFavorites();

      // Check if already favorited
      if (favorites.some((fav) => fav.id === stopPlace.id)) {
        return;
      }

      const newFavorite: FavoriteStopPlace = {
        ...stopPlace,
        addedAt: new Date().toISOString(),
      };

      favorites.push(newFavorite);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to add favorite stop place:", error);
    }
  }

  public removeFavorite(stopPlaceId: string): void {
    try {
      const favorites = this.getFavorites();
      const filtered = favorites.filter((fav) => fav.id !== stopPlaceId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Failed to remove favorite stop place:", error);
    }
  }

  public isFavorite(stopPlaceId: string): boolean {
    return this.getFavorites().some((fav) => fav.id === stopPlaceId);
  }

  public getFavoriteCount(): number {
    return this.getFavorites().length;
  }

  public clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear favorite stop places:", error);
    }
  }
}
