#!/usr/bin/env node

var fs = require('fs');
const { request, gql } = require('graphql-request');
const config = require('./src/config/environments/prod.json');

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

request(config.tiamatBaseUrl, introspectionQuery).then(response => {
  fs.writeFileSync(
    './src/graphql/Tiamat/schema.json',
    JSON.stringify(response),
    'utf8'
  );
}).catch(err => {
  console.log("Unable to fetch schema, server exited with error", err);
  process.exit(1);
});
