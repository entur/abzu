const Routes = require("./index");

const getRouteEntries = (endPointBase, path) => {
  return Object.keys(Routes).map((key) => endPointBase + Routes[key] + path);
};

module.exports = {
  getRouteEntries: getRouteEntries,
};
