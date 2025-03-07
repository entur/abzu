# Statens Vegvesen StreetView Link

Render an icon-link for Statens Vegesen's StreetView service (link to service). Only available in Norway.

## Props

- belongsToNeighbourStop: ???
- position: coordinates to open in the street view service

## Enabling the feature

Once enabled in bootstrap.json

    "featureFlags": {
        "SVVStreetViewLink": true
    }

SVVStreetViewLink feature can be wired in as:

    <ComponentToggle<Features, SVVStreetViewLinkProps>
        feature="SVVStreetViewLink"
        componentProps={{
          belongsToNeighbourStop: false,
          position: [69, 10];
        }}
    />
