// app.js where keycloack is disabled.

'use strict';

angular.module('abzu.service', []);

// Declare app level module which depends on views, and components
var module = angular.module('abzu', [
  'ngRoute',
  'ui-leaflet',
  'abzu.stopPlaceEditor',
  'abzu.stopPlaceList',
  'abzu.service',
  'abzu.topBar',
  'abzu.version'
]);

module.config(['$routeProvider', function($routeProvider) {
	console.log("Setting up route provider");
 	$routeProvider.otherwise({redirectTo: '/stopPlaceList'});
}]);

// Set up keycloak and the Auth service.
angular.element(document).ready(function () {

  console.log("Setting up keycloak: Keycloak is never used");

  module.factory('Auth', function() {
    var Auth = {};

    Auth.logout = function() {
    }

    Auth.getIdentity = function() {
    }

    Auth.getToken = function() {
    }

    Auth.updateToken = function(seconds) {
    }

    return Auth;
  });
/*
  var keycloakAuth = new Keycloak('config/keycloak.json');
  keycloakAuth.init({ onLoad: 'login-required' }).success(function () {

    module.factory('Auth', function() {
      var Auth = {};

      Auth.logout = function() {
          keycloakAuth.logout();
      }

      Auth.getIdentity = function() {
          return keycloakAuth.idTokenParsed;
      }

      Auth.getToken = function() {
          return keycloakAuth.token;
      }

      Auth.updateToken = function(seconds) {
      	return keycloakAuth.updateToken(seconds);
      }

      return Auth;
    });

    module.factory('authInterceptor', ["$q", "Auth", function($q, Auth) {
 	    function request(config) {
    	  console.log("request");
        var deferred = $q.defer();

        if (Auth.getToken()) {
          Auth.updateToken(5).success(function() {
            console.log("Token seems valid");
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + Auth.getToken();

            deferred.resolve(config);
          }).error(function() {
            deferred.reject('Failed to refresh token');
          });
        }
        return deferred.promise;
      };

      function responseError(response) {
        console.log("Response error ")
        if (response.status == 401) {
            console.log("Got 401. logout.")
            console.log(response);
            Auth.logout();
          }
          return $q.reject(response);
       };

		  return {
        request: request,
        responseError: responseError
		  };
    }]);

		module.config(function($httpProvider) {
			console.log("Setting up httpProvider with the authInterceptor");
    	$httpProvider.interceptors.push('authInterceptor');
		});

    console.log("Read config from file before angular bootstrap");

    getJson('config/config.json', function(config) {
        module.value('appConfig', config);

        console.log("Calling angular bootstrap");
        angular.bootstrap(document, ['abzu']);

      }, function(error) {
        console.log("Error reading configuration file 'config/config.json'. Angular bootstrap will not be called.");
        console.log(error);
      });

    }).error(function () {
      console.log("ERROR setting up keycloak");
    });

    */

    getJson('config/config.json', function(config) {
        module.value('appConfig', config);

        console.log("Calling angular bootstrap");
        angular.bootstrap(document, ['abzu']);

      }, function(error) {
        console.log("Error reading configuration file 'config/config.json'. Angular bootstrap will not be called.");
        console.log(error);
      });

});

function getJson(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        success(JSON.parse(xhr.responseText));
      } else {
        error(xhr);
      }
    }
  };
  xhr.open("GET", path, true);
  xhr.send();
}
