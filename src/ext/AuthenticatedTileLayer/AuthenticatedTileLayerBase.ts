import Axios from "axios";
import {
  Coords,
  DoneCallback,
  TileLayerOptions as LeafletTileLayerOptions,
  TileLayer,
} from "leaflet";

export type AuthenticatedTileLayerBaseOptions = LeafletTileLayerOptions & {
  accessToken: string;
  url: string;
};

export class AuthenticatedTileLayerBase extends TileLayer {
  private readonly accessToken: string | undefined;

  constructor(
    urlTemplate: string,
    options?: AuthenticatedTileLayerBaseOptions,
  ) {
    super(urlTemplate, options);
    this.accessToken = options?.accessToken;
  }

  createTile(coords: Coords, done: DoneCallback) {
    const imgEl = document.createElement("img");
    const url = this.getTileUrl(coords);
    const headers: Record<string, string> = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    Axios.get(url, { headers, responseType: "blob" })
      .then((res) => {
        const blob = new Blob([res.data], {
          type: res.headers["content-type"]?.toString(),
        });
        imgEl.src = URL.createObjectURL(blob);
        done(undefined, imgEl);
      })
      .catch((err) => done(err, undefined));

    return imgEl;
  }
}
