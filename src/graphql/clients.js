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

import { ApolloClient, InMemoryCache } from "@apollo/client";

import schema from "./Tiamat/schema.json";

const CLIENT_NAME = "entur-abzu";

export const createTiamatClient = () => {
  const possibleTypes = schema.__schema.types.reduce((acc, supertype) => {
    if (supertype.possibleTypes) {
      acc[supertype.name] = supertype.possibleTypes.map(
        (subtype) => subtype.name
      );
    }
    return acc;
  }, {});

  return new ApolloClient({
    uri: window.config.tiamatBaseUrl,
    cache: new InMemoryCache({
      typePolicies: {
        StopPlace: {
          keyFields: ["id", "version"],
        },
      },
      possibleTypes,
    }),
    headers: {
      "ET-Client-Name": CLIENT_NAME,
      "Et-Client-Id": window.config.hostname,
    },
  });
};

export const createOTPClient = () => {
  return new ApolloClient({
    uri: window.config.OTPUrl,
    cache: new InMemoryCache(),
    headers: {
      "ET-Client-Name": CLIENT_NAME,
      "Et-Client-Id": window.config.hostname,
    },
  });
};
