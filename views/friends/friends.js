angular.module('myApp.friends', ['myApp.env'])

.controller('friendsCtrl', function($scope, $localstorage, facebook) {
  $scope.noFriend = false;
  $scope.friendsList;

  var userInfo = $localstorage.get('firebase:session::ionic-fboauth');

  facebook.getFriends($scope, userInfo);

  $scope.doRefresh = function() {
    facebook.getFriends($scope, userInfo);
    $scope.$broadcast('scroll.refreshComplete');
  };
});