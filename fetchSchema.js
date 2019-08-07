#!/usr/bin/env node

var fs = require('fs');
const graphqlFetch = require('graphql-fetch');
const convictPromise = require('./config/convict.js');
const introspectionQuery = require('./graphql/Tiamat/introspection').introspectionQuery;

const fetchSchema = async () => {
  const convict = await convictPromise;
  const url = convict.get('tiamatBaseUrl');
  const response = await graphqlFetch(url)(introspectionQuery);

  fs.writeFileSync(
    './graphql/Tiamat/schema.json',
    JSON.stringify(response.data),
    'utf8'
  );
}

try {
  fetchSchema();
} catch(err) {
  console.log("Unable to fetch schema, server exited with error");
  process.exit(1);
}
