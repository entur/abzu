var convict = require('convict');
var request = require('request');
var fs = require('fs');

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
  nabuBaseUrl: {
    doc: "Base URL for for nabu including slash",
    format: "url",
    default: "http://localhost:18081/",
    env: "NABU_BASE_URL"
  },
  mardukBaseUrl: {
    doc: "Base URL for for marduk including slash",
    format: "url",
    default: "http://localhost:18080/",
    env: "MARDUK_BASE_URL"
  }

});

// If configuration URL exists, read it and update the configuration object
var configUrl = conf.get('configUrl');
if ( configUrl.indexOf("do_not_read") == -1 ) {
  // Read contents from configUrl if it is given
  request( configUrl, function( error, response, body ) {
    if ( !error && response.statusCode == 200 ) {
      // Reconfigure if config was read:
      fs.writeFileSync('/tmp/bel_config.json',body);
      conf.loadFile('/tmp/bel_config.json');
      conf.validate({strict: true});
    } else {
      var err = "Could not load data from "+configUrl
      throw new Error(err);
    }
  });
} else {
  console.log("The CONFIG_URL element has not been set, so you use the default dev-mode configuration")
  conf.validate({strict: true});
}

module.exports = conf;
