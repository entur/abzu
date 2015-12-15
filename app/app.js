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

	console.log("Setting up keycloak");
    var keycloakAuth = new Keycloak('keycloak.json');
    keycloakAuth.init({ onLoad: 'login-required' }).success(function () {
    	console.log("Keycloak init success");
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
	                    config.headers = config.headers || {};
	                    config.headers.Authorization = 'Bearer ' + Auth.getToken();

	                    deferred.resolve(config);
	                }).error(function() {
	                        deferred.reject('Failed to refresh token');
	                });
	            }
	            return deferred.promise;
	        };

	        function requestError(response) {
	        	console.log("Request error ")
	        	console.log(response);
		    		if (response.status == 401) {
	                console.log("Got 401. logout.")
	                console.log(response);
	                Auth.logout();
	            }
	            return $q.reject(response);
       		 };

    		  return {
            request: request,
            requestError: requestError
    		  };
        }]);

		module.config(function($httpProvider) {
			console.log("Setting up httpProvider with the authInterceptor");
    		$httpProvider.interceptors.push('authInterceptor');
		});

		console.log("Calling angular bootstrap");
		angular.bootstrap(document, ['abzu']);

    }).error(function () {
        //window.location.reload();
        console.log("ERROR setting up keycloak");
    });
});
