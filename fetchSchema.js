#!/usr/bin/env node

var fs = require('fs');
const config = require('./public/bootstrap.json');

const introspectionQuery = `
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

const request = async (url, query) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  const { data, errors } = await response.json();
  if (errors) {
    throw new Error(errors.map((error) => error.message).join('; '));
  }
  return data;
};

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
