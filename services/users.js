angular.module('myApp.usersServices', [])

.factory('usersInfos', ['$window', function($window) {
  var singleUserInfo = {};
  return {
    singleUserInfoSet: function(data) {
      singleUserInfo.id = data.id;
      singleUserInfo.name = data.name;
      singleUserInfo.picture = data.picture.data.url;
    },
    singleUserInfoGet: function() {
      return singleUserInfo;
    }
  }
}]);


