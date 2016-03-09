angular.module('myApp.authService', [])

.factory('userAuth', function($http, $localstorage) {

  var isAuth = function() {
    return !!$localstorage.get('firebase:session::ionic-fboauth');
  };

  return {
    isAuth: isAuth
  };

});