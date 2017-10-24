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


import gql from 'graphql-tag';
import Fragments from './Fragments';


export const neighbourStopPlaceQuays = gql`
  query neighbourStopPlaceQuays($id: String!) {
      stopPlace(id: $id) {
          id 
          ...on ParentStopPlace {
              children {
                  id
                  quays {
                      id
                      version
                      geometry {
                          coordinates
                      }
                      compassBearing
                      publicCode
                      privateCode {
                          value
                      }
                  }
              }
          }
          ...on StopPlace {
              id
              quays {
                  id
                  version
                  geometry {
                      coordinates
                  }
                  compassBearing
                  publicCode
                  privateCode {
                      value
                  }
              }
          }
      }
  }
`;

export const stopPlaceBBQuery = gql`
    query stopPlaceBBox($ignoreStopPlaceId: String, $lonMin: BigDecimal!, $lonMax: BigDecimal!, $latMin: BigDecimal!, $latMax: BigDecimal!, $includeExpired: Boolean) {
        stopPlaceBBox(ignoreStopPlaceId: $ignoreStopPlaceId, latMin: $latMin, latMax: $latMax, lonMin: $lonMin, lonMax: $lonMax, size: 500, includeExpired: $includeExpired) {
            id
            geometry {
                coordinates
            }
            name {
                value
            }
            topographicPlace {
                name {
                    value
                }
                topographicPlaceType
            }
            validBetween {
                fromDate
                toDate
            }
            ...on StopPlace {
                __typename
                stopPlaceType
                submode
            }
            ...on ParentStopPlace {
                children {
                    id
                    stopPlaceType
                    submode
                    geometry {
                        coordinates
                    }
                    topographicPlace {
                        name {
                            value
                        }
                        topographicPlaceType
                    }
                    validBetween {
                        fromDate
                        toDate
                    }
                    name {
                        value
                    }
                }
                name {
                    value
                }
                __typename
            }
        }
    },
`;

export const allEntities = gql`
    query stopPlaceAndPathLink($id: String!) {
        __typename
        pathLink(stopPlaceId: $id) {
            ...VerbosePathLink
        },
        stopPlace(id: $id) {
            ...VerboseStopPlace
            ...VerboseParentStopPlace
        }
        parking: parking(stopPlaceId: $id) {
            ...VerboseParking
        },
        versions:
            stopPlace(id: $id, allVersions: true, size: 100) {
                    id
                    validBetween {
                        fromDate
                        toDate
                    }
                    name {
                        value
                        lang
                    }
                    version
                    versionComment
                    changedBy
                    ...on ParentStopPlace {
                        children {
                            id
                            validBetween {
                                fromDate
                                toDate
                            }
                            name {
                                value
                                lang
                            }
                            version
                            versionComment
                            changedBy
                        }
                    }
                }
        },
    ${Fragments.stopPlace.verbose},
    ${Fragments.parentStopPlace.verbose},
    ${Fragments.pathLink.verbose},
    ${Fragments.parking.verbose},
`;

export const getStopById = gql`
    query getStopById($id: String!) {
        stopPlace(id: $id) {
            id
            __typename
            keyValues {
                key
                values
            }
            name {
                value
            }
            tags {
                name
                comment
                created
                createdBy
            }
            geometry {
                coordinates
            }
            validBetween {
                fromDate
                toDate
            }
            accessibilityAssessment {
                limitations {
                    wheelchairAccess
                }
            }
            topographicPlace {
                name {
                    value
                }
                topographicPlaceType
                parentTopographicPlace {
                    name {
                        value
                    }
                }
            }
            ... on StopPlace {
                stopPlaceType
                submode
                transportMode
                quays {
                    id
                    importedId
                }
            }
            ... on ParentStopPlace {
                geometry {
                    coordinates
                    type
                }
                children {
                    name {
                        value
                    }
                    id
                    importedId
                    stopPlaceType
                    transportMode
                    submode
                    geometry {
                        coordinates
                    }
                }
            }
        }
    },
`;

export const findStop = gql`
    query findStop($query: String, $municipalityReference: [String], $stopPlaceType: [StopPlaceType], $countyReference: [String], $pointInTime: DateTime) {
        stopPlace(query: $query, municipalityReference: $municipalityReference, stopPlaceType: $stopPlaceType, countyReference: $countyReference, size: 7, pointInTime: $pointInTime) {
            id
            __typename
            keyValues {
                key
                values
            }
            name {
                value
            }
            tags {
                name
                comment
                created
                createdBy
            }
            geometry {
                coordinates
            }
            validBetween {
                fromDate
                toDate
            }
            accessibilityAssessment {
                limitations {
                    wheelchairAccess
                }
            }
            topographicPlace {
                name {
                    value
                }
                topographicPlaceType
                parentTopographicPlace {
                    name {
                        value
                    }
                }
            }
            ... on StopPlace {
              stopPlaceType
              submode
              transportMode
              quays {
                  id
                  importedId
              }
            }
           ... on ParentStopPlace {
               geometry {
                   coordinates 
                   type 
               }
               children {
                   id
                   name {
                       value
                   }
                   importedId
                   stopPlaceType 
                   transportMode 
                   submode
                   geometry {
                       coordinates
                   }
               }
           }
        }
    },
`;

export const findStopForReport = gql`
    query findStopForReport($query: String, $importedId: String, $municipalityReference: [String], $stopPlaceType: [StopPlaceType], $countyReference: [String], $withoutLocationOnly: Boolean!, $withDuplicateImportedIds: Boolean!, $pointInTime: DateTime) {
        stopPlace(query: $query, importedId: $importedId, municipalityReference: $municipalityReference, stopPlaceType: $stopPlaceType, countyReference: $countyReference, withoutLocationOnly: $withoutLocationOnly, withDuplicatedQuayImportedIds: $withDuplicateImportedIds, pointInTime: $pointInTime, size: 300) {
            ...on StopPlace {
                ...ReportStopPlace
            }
            ...on ParentStopPlace {
                ...ReportParentStopPlace
            }
        }
    },
  ${Fragments.stopPlace.reportView},
  ${Fragments.parentStopPlace.reportView}
`;

export const allVersionsOfStopPlace = gql`
    query stopPlaceAllVersions($id: String!) {
        versions:
        stopPlace(id: $id, allVersions: true, size: 100) {
            id
            ...on StopPlace {
                validBetween {
                    fromDate
                    toDate
                }
                name {
                    value
                    lang
                }
                changedBy
                version
                versionComment
            }
            ...on ParentStopPlace {
                validBetween {
                    fromDate
                    toDate
                }
                name {
                    value
                    lang
                }
                changedBy
                version
                versionComment
            }
        }
    },
`;


export const getTagsQuery = gql`
  query getTagsQuery($idReference: String!) {
      stopPlace(id: $idReference) {
          __typename
          tags {
              name
              comment
              created
              createdBy
              idReference
          }
      }
  }
`

export const findTagByNameQuery = gql`
  query findTagByName($name: String!) {
      tags(name: $name) {
          name
          comment
          created
          createdBy
          idReference
      }
  }
`;

export const stopPlaceAndPathLinkByVersion = gql`
    query stopPlaceAndPathLink($id: String!, $version: Int) {
        pathLink(stopPlaceId: $id) {
            ...VerbosePathLink
        },
        stopPlace(id: $id, version: $version) {
            ...VerboseStopPlace
            ...VerboseParentStopPlace
        }
        parking: parking(stopPlaceId: $id) {
            ...VerboseParking
        }
        versions:
        stopPlace(id: $id, allVersions: true, size: 100) {
            id
            validBetween {
                fromDate
                toDate
            }
            name {
                value
                lang
            }
            version
            versionComment
            changedBy
        }
    },
    ${Fragments.stopPlace.verbose},
    ${Fragments.parentStopPlace.verbose},
    ${Fragments.pathLink.verbose},
    ${Fragments.parking.verbose}
`;

export const topopGraphicalPlacesQuery = gql`
    query TopopGraphicalPlaces($query: String!) {
        topographicPlace(query: $query) {
            id
            name {
                value
            }
            topographicPlaceType
            parentTopographicPlace {
                name {
                    value
                }
            }
        }
    }
`;

export const topopGraphicalPlacesReportQuery = gql`
    query TopopGraphicalPlacesForReport($query: String!) {
        topographicPlace(query: $query) {
            id
            name {
                value
            }
            topographicPlaceType
            parentTopographicPlace {
                name {
                    value
                }
            }
        }
    }
`;

export const getMergeInfoStopPlace = gql`
    query MergeInfoStopPlace($stopPlaceId: String!) {
        stopPlace(id: $stopPlaceId) {
            ...on StopPlace {
                quays {
                    id
                    privateCode {
                        value
                    }
                    compassBearing
                    publicCode
                }
            }
        }
    }
`;

export const getParkingForMultipleStopPlaces = stopPlaceIds => {
  const stopPlaces = stopPlaceIds.map(id => ({
    id,
    alias: id.replace('NSR:StopPlace:', 'StopPlace')
  }));

  let queryContent = '';

  stopPlaces.forEach(stopPlace => {
    queryContent += `
        ${stopPlace.alias}: parking(stopPlaceId: "${stopPlace.id}") {
            id
            parkingVehicleTypes
        }
    `;
  });

  return gql`
    query {
        ${queryContent}
    }
  `;
};

export const getStopPlacesById = stopPlaceIds => {

    const stopPlaces = stopPlaceIds.map(id => ({
    id,
    alias: id.replace('NSR:StopPlace:', 'StopPlace')
  }));

  let queryContent = '';

  stopPlaces.forEach(stopPlace => {
    queryContent += `
        ${stopPlace.alias}: stopPlace(id: "${stopPlace.id}") {
            ...on StopPlace {
                id
                name {
                    value
                }
                submode
                geometry {
                  coordinates
                }
                transportMode
                stopPlaceType
                quays {
                    id
                    publicCode
                    privateCode {
                        value
                    }
                }
            }
        }
    `;
  });

  return gql`
      query {
          ${queryContent}
      }
  `;

}

export const getPolygons = ids => {
  let queryContent = '';

  ids.forEach(id => {
    let alias = id.replace(':', '').replace(':', '');

    queryContent += `
        ${alias}: topographicPlace(id: "${id}") {
           id
            polygon {
                coordinates
            }
        }
    `;
  });

  return gql`
      query {
          ${queryContent}
      }
  `;
};

export const getQueryTopographicPlaces = ids => {
  let queryContent = '';

  ids.forEach(id => {
    let alias = id.replace(':', '').replace(':', '');

    queryContent += `
        ${alias}: topographicPlace(id: "${id}") {
           id
           name {
            value
           }
           topographicPlaceType
           parentTopographicPlace {
            name {
              value
            }
          }
       }
    `;
  });

  return gql`
      query {
          ${queryContent}
      }
  `;
};
