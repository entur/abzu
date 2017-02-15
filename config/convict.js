var convict = require('convict');
var request = require('request');
var fs = require('fs');

module.exports = new Promise(function(resolve, reject){
  var conf = convict({
    env: {
      doc: "The applicaton environment.",
      format: ["production", "development"],
      default: "development",
      env: "NODE_ENV"
    },
    configUrl: {
      doc: "URL for where to read the configuration",
      format: "*",
      default: "http://rutebanken.org/do_not_read",
      env: "CONFIG_URL"
    },
    tiamatBaseUrl: {
      doc: "Base URL for for tiamat graphql endpoint",
      format: "url",
      default: "https://test.rutebanken.org/apiman-gateway/rutebanken/tiamat/1.0/graphql",
      env: "TIAMAT_BASE_URL"
    },
    endpointBase: {
      doc: "Base URL for for timat including slash",
      format: String,
      default: "/",
      env: "ENDPOINTBASE"
    },
    OSMUrl: {
      doc: "URL for OSM map",
      format: String,
      default: "https://test.rutebanken.org/api/map/1.0/{z}/{x}/{y}.png",
      env: "OSM_URL"
    }

  });

  // If configuration URL exists, read it and update the configuration object
  var configUrl = conf.get('configUrl');

  console.log("configUrl", configUrl);

  if ( configUrl.indexOf("do_not_read") == -1 ) {
    // Read contents from configUrl if it is given
    request( configUrl, function( error, response, body ) {
      if ( !error && response.statusCode == 200 ) {
        body = JSON.parse(body)
        conf.load(body);
        conf.validate();
        resolve(conf)
      } else {
        reject("Could not load data from " + configUrl, error)
      }
    });
  } else {
    console.log("The CONFIG_URL element has not been set, so you use the default dev-mode configuration")
    conf.validate();
    resolve(conf)
  }
})
