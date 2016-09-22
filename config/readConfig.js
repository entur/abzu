import axios from 'axios'

/*
Reading config json as served out of the node application.
*/

var configreader = {}
var config

configreader.readConfig = (callback) => {

  if ( config && typeof config !== 'undefined' ) {
    callback ( config )
    return
  }
  axios({
    url: "config.json",
    timeout: 2000,
    method: 'get',
    responseType: 'json'
  })
    .then(function(response) {
      config = response.data;
      callback ( config )
    })
    .catch(function(response){
      throw new Error("Could not read config: "+response)
    })
  }

export default configreader
