angular.module('AskUs.currentUserServices', [])

.factory('currentUserInfos', ['$localstorage', function($localstorage) {
  return {
    currentUserInfoGet: function() {
      var userData = JSON.parse($localstorage.get('firebase:session::askus-app'));
      return userData.facebook;
    }
  }
}]);


