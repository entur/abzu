import { FeatureComponent } from "@entur/react-component-toggle";
import {
  createElementObject,
  createTileLayerComponent,
} from "@react-leaflet/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tile } from "../../config/ConfigContext";
import { RootState } from "../../store/store";
import {
  AuthenticatedTileLayerBase,
  AuthenticatedTileLayerBaseOptions,
} from "./AuthenticatedTileLayerBase";

const AuthenticatedTileLayerComponent = createTileLayerComponent<
  AuthenticatedTileLayerBase,
  AuthenticatedTileLayerBaseOptions
>((props, context) => {
  const { url } = props;
  const layer = new AuthenticatedTileLayerBase(url, props);
  return createElementObject(layer, context);
});

export const AuthenticatedTileLayer: FeatureComponent<Tile> = (props: Tile) => {
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
      <AuthenticatedTileLayerComponent
        accessToken={accessToken}
        tms={props.tms === true}
        url={props.url}
        attribution={props.attribution}
      />
    )
  );
};
