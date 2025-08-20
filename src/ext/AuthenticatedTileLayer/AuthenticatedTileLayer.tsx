import { FeatureComponent } from "@entur/react-component-toggle";
import {
  createElementObject,
  createTileLayerComponent,
} from "@react-leaflet/core";
import Axios from "axios";
import {
  Coords,
  DoneCallback,
  TileLayerOptions as LeafletTileLayerOptions,
  TileLayer,
} from "leaflet";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tile } from "../../config/ConfigContext";
import { RootState } from "../../store/store";

type AuthTileLayerOptions = LeafletTileLayerOptions & {
  accessToken: string;
  url: string;
};

class AuthTileLayer extends TileLayer {
  private readonly accessToken: string | undefined;

  constructor(urlTemplate: string, options?: AuthTileLayerOptions) {
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

const AuthTileLayerCmp = createTileLayerComponent<
  AuthTileLayer,
  AuthTileLayerOptions
>((props, context) => {
  const { url } = props;
  const layer = new AuthTileLayer(url, props);
  return createElementObject(layer, context);
});

export const AuthenticatedTileLayer: FeatureComponent<any> = (props: Tile) => {
  const { getAccessToken } = useSelector((state: RootState) => ({
    getAccessToken: state.user.auth.getAccessToken,
  }));

  const [accessToken, setAccessToken] = useState<string | undefined>();

  useEffect(() => {
    let isSubscribing = true;

    const fetchToken = async () => {
      const token = await getAccessToken();
      if (isSubscribing) {
        setAccessToken(token);
      }
    };
    fetchToken().catch(console.error);

    return () => {
      isSubscribing = false;
    };
  }, [setAccessToken, getAccessToken]);

  return (
    accessToken &&
    props.url && (
      <AuthTileLayerCmp
        accessToken={accessToken}
        tms={props.tms === true}
        url={props.url}
        attribution={props.attribution}
      />
    )
  );
};
