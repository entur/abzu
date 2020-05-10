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

export default {
  id: "NSR:GroupOfStopPlaces:1",
  name: {
    value: "Downtown Sætre",
    __typename: "EmbeddableMultilingualString",
  },
  members: [
    {
      __typename: "StopPlace",
      id: "NSR:StopPlace:15348",
      name: {
        value: "Gunnaråsen",
        __typename: "EmbeddableMultilingualString",
      },
      geometry: {
        type: "Point",
        coordinates: [[10.522878, 59.677607]],
        __typename: "GeoJSON",
      },
      topographicPlace: {
        name: {
          value: "Hurum",
          __typename: "EmbeddableMultilingualString",
        },
        parentTopographicPlace: {
          name: {
            value: "Buskerud",
            __typename: "EmbeddableMultilingualString",
          },
          __typename: "TopographicPlace",
        },
        __typename: "TopographicPlace",
      },
      submode: null,
      stopPlaceType: "onstreetBus",
    },
    {
      __typename: "StopPlace",
      id: "NSR:StopPlace:15342",
      name: {
        value: "Sætre sentrum",
        __typename: "EmbeddableMultilingualString",
      },
      geometry: {
        type: "Point",
        coordinates: [[10.526195, 59.682017]],
        __typename: "GeoJSON",
      },
      topographicPlace: {
        name: {
          value: "Hurum",
          __typename: "EmbeddableMultilingualString",
        },
        parentTopographicPlace: {
          name: {
            value: "Buskerud",
            __typename: "EmbeddableMultilingualString",
          },
          __typename: "TopographicPlace",
        },
        __typename: "TopographicPlace",
      },
      submode: null,
      stopPlaceType: "onstreetBus",
    },
    {
      __typename: "StopPlace",
      id: "NSR:StopPlace:15338",
      name: {
        value: "Sætre bussterminal",
        __typename: "EmbeddableMultilingualString",
      },
      geometry: {
        type: "Point",
        coordinates: [[10.53034, 59.680506]],
        __typename: "GeoJSON",
      },
      topographicPlace: {
        name: {
          value: "Hurum",
          __typename: "EmbeddableMultilingualString",
        },
        parentTopographicPlace: {
          name: {
            value: "Buskerud",
            __typename: "EmbeddableMultilingualString",
          },
          __typename: "TopographicPlace",
        },
        __typename: "TopographicPlace",
      },
      submode: null,
      stopPlaceType: "onstreetBus",
    },
  ],
  __typename: "GroupOfStopPlaces",
};
