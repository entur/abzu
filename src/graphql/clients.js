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

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

import schema from "./Tiamat/schema.json";

const possibleTypes = schema.__schema.types.reduce((acc, supertype) => {
  if (supertype.possibleTypes) {
    acc[supertype.name] = supertype.possibleTypes.map(
      (subtype) => subtype.name,
    );
  }
  return acc;
}, {});

const CLIENT_NAME = "entur-abzu";

let tiamatClient = null;
let otpClient = null;

export const getTiamatClient = () => {
  if (tiamatClient === null) {
    tiamatClient = new ApolloClient({
      link: new HttpLink({
        uri: window.config.tiamatBaseUrl,
        headers: {
          "ET-Client-Name": CLIENT_NAME,
          "Et-Client-Id": window.config.hostname,
        },
      }),
      cache: new InMemoryCache({
        typePolicies: {
          StopPlace: {
            keyFields: ["id", "version"],
          },
          ParentStopPlace: {
            keyFields: ["id", "version"],
          },
        },
        possibleTypes,
      }),
    });
  }

  return tiamatClient;
};

export const getOTPClient = () => {
  if (otpClient === null) {
    otpClient = new ApolloClient({
      link: new HttpLink({
        uri: window.config.OTPUrl,
        headers: {
          "ET-Client-Name": CLIENT_NAME,
          "Et-Client-Id": window.config.hostname,
        },
      }),
      cache: new InMemoryCache(),
    });
  }

  return otpClient;
};
