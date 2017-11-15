const Routes = require('./index');

const getRouteEntries = (endPointBase, path) => {
  return Object.keys(Routes).map(route => (
    endPointBase + route + path
  ));
};

module.exports = {
  getRouteEntries: getRouteEntries
};
