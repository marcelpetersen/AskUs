angular.module('myApp.friends', ['myApp.env'])

.controller('friendsCtrl', function($scope, $localstorage, facebook, $timeout, usersInfos) {
  $scope.noFriend = false;
  $scope.friendsList;

  var userInfo = $localstorage.get('firebase:session::ionic-fboauth');

  facebook.getFriends($scope, userInfo).then(function(data) {
    $scope.friendsList = data;
  })

  $scope.doRefresh = function() {
    angular.element('.icon-refreshing').addClass('spin');
    facebook.getFriends($scope, userInfo).then(function(data) {
      $scope.friendsList = data;
      $scope.$broadcast('scroll.refreshComplete');
      angular.element('.icon-refreshing').removeClass('spin');
    }); 
  };

  $scope.friendPage = function(user) {
    usersInfos.singleUserInfoSet(user);
  }
});