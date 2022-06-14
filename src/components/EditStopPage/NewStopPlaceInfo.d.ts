import { ReactElement } from "react";

interface Props {
  open: boolean;
  stopPlaceId: string;
}

declare const NewStopPlaceInfo: (props: Props) => ReactElement;

export default NewStopPlaceInfo;
