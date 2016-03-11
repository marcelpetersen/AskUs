angular.module('myApp.currentUserServices', [])

.factory('currentUserInfos', function($localstorage) {
  return {
    currentUserInfoGet: function() {
      var userData = JSON.parse($localstorage.get('firebase:session::ionic-fboauth'));
      return userData.facebook;
    }
  }
});


