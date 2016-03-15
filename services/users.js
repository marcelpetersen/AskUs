angular.module('myApp.usersServices', [])

.factory('usersInfos', ['$window', function($window) {
  var singleUserInfo = {};
  return {
    singleUserInfoSet: function(data) {
      singleUserInfo.id = data.id;
      singleUserInfo.name = data.name;
      singleUserInfo.picture = data.picture
    },
    singleUserInfoGet: function() {
      return singleUserInfo;
    }
  }
}]);


