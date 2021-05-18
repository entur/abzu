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

import {
  ApolloClient,
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "@apollo/client";
import schema from "./Tiamat/schema.json";
import uuid from "uuid/v4";

const CLIENT_NAME = "entur-abzu";

export const createTiamatClient = () => {
  // const networkInterface = createNetworkInterface({
  //   uri: window.config.tiamatBaseUrl,
  // });

  // networkInterface.use([
  //   {
  //     applyMiddleware(req, next) {
  //       if (!req.options.headers) {
  //         req.options.headers = {};
  //       }

  const token = localStorage.getItem("ABZU::jwt");
  //req.options.headers.authorization = token ? `Bearer ${token}` : null;
  const bearer = token ? `Bearer ${token}` : null;
  //       req.options.headers["ET-Client-Name"] = CLIENT_NAME;
  //       req.options.headers["X-Correlation-Id"] = uuid();

  //       if (window.config.hostname) {
  //         req.options.headers["ET-Client-Id"] = window.config.hostname;
  //       }

  //       next();
  //     },
  //   },
  // ]);

  // const fragmentMatcher = new IntrospectionFragmentMatcher({
  //   introspectionQueryResultData: schema,
  // });

  // return new ApolloClient({
  //   networkInterface,
  //   fragmentMatcher,
  // });

  // Migration notes:
  // auth headers and correlation id can be set on context property of client query method
  // For introspection see https://www.apollographql.com/docs/react/data/fragments/#defining-possibletypes-manually

  return new ApolloClient({
    uri: window.config.tiamatBaseUrl,
    cache: new InMemoryCache({
      typePolicies: {
        StopPlace: {
          keyFields: ["id", "version"],
        },
      },
    }),
    headers: {
      "ET-Client-Name": CLIENT_NAME,
      "Et-Client-Id": window.config.hostname,
      Authorization: bearer,
    },
  });
};

export const createOTPClient = () => {
  // const networkInterface = createNetworkInterface({
  //   uri: window.config.OTPUrl,
  // });

  // networkInterface.use([
  //   {
  //     applyMiddleware(req, next) {
  //       if (!req.options.headers) {
  //         req.options.headers = {};
  //       }

  //       req.options.headers["ET-Client-Name"] = CLIENT_NAME;

  //       if (window.config.hostname) {
  //         req.options.headers["ET-Client-Id"] = window.config.hostname;
  //       }

  //       next();
  //     },
  //   },
  // ]);

  return new ApolloClient({
    uri: window.config.OTPUrl,
    cache: new InMemoryCache(),
    headers: {
      "ET-Client-Name": CLIENT_NAME,
      "Et-Client-Id": window.config.hostname,
    },
  });
};
