import { FeatureComponent } from "@entur/react-component-toggle";
import VegvesenIcon from "../../static/icons/vegvesen-logo.png";
import { SVVStreetViewLinkProps } from "./types";

const getVegvesenURL = (position: number[]) => {
  return `https://vegbilder.atlas.vegvesen.no/?lat=${position[0]}&lng=${position[1]}&zoom=16&view=image`;
};

export const SVVStreetViewLink: FeatureComponent<SVVStreetViewLinkProps> = ({
  belongsToNeighbourStop,
  position,
}) => {
  return (
    <div
      style={{
        marginLeft: belongsToNeighbourStop ? 0 : 10,
        cursor: "pointer",
      }}
    >
      <a
        href={getVegvesenURL(position)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          alt=""
          style={{
            width: 20,
            height: 22,
            border: "1px solid grey",
            borderRadius: 50,
          }}
          src={VegvesenIcon}
        />
      </a>
    </div>
  );
};
