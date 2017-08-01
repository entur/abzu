module.exports = {
  geoNorgeURL: 'http://gatekeeper1.geonorge.no/BaatGatekeeper/',
  keyCloak: {
    realm: 'rutebanken',
    'tokens-not-before': 1490857383,
    'public-client': true,
    'auth-server-url': '' // injected on run-time,
    resource: 'neti-frontend'
  },
};