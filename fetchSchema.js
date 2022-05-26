#!/usr/bin/env node

var fs = require('fs');
const { request, gql } = require('graphql-request');
const convictPromise = require('./src/config/convict.js');

const introspectionQuery = gql`
{
  __schema {
    types {
      kind
      name
      possibleTypes {
        name
      }
    }
  }
}
`;

convictPromise.then(convict => {
  const url = convict.get('tiamatBaseUrl');
  return request(url, introspectionQuery);
}).then(response => {
  fs.writeFileSync(
    './src/graphql/Tiamat/schema.json',
    JSON.stringify(response),
    'utf8'
  );
}).catch(err => {
  console.log("Unable to fetch schema, server exited with error", err);
  process.exit(1);
});
