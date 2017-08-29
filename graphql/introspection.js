exports.introspectionQuery = `
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
