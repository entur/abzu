#!/usr/bin/env node

var fs = require('fs');
const graphqlFetch = require('graphql-fetch');
const convictPromise = require('./config/convict.js');
const introspectionQuery = require('./graphql/Tiamat/introspection').introspectionQuery;

convictPromise.then(convict => {
  const url = convict.get('tiamatBaseUrl');
  return graphqlFetch(url)(introspectionQuery);
}).then(response => {
  fs.writeFileSync(
    './graphql/Tiamat/schema.json',
    JSON.stringify(response.data),
    'utf8'
  );
}).catch(err => {
  console.log("Unable to fetch schema, server exited with error", err);
  process.exit(1);
});
