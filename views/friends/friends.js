angular.module('myApp.friends', ['myApp.env'])

.controller('friendsCtrl', ['$scope', '$localstorage', 'facebook', '$timeout', 'usersInfos', function($scope, $localstorage, facebook, $timeout, usersInfos) {
  $scope.noFriend = false;
  $scope.friendsList;

  var userInfo = $localstorage.get('firebase:session::ionic-fboauth');

  facebook.getFriends($scope, userInfo).then(function(data) {
    $scope.friendsList = data;
    if (data.length === 0) {$scope.noFriend = true;}

    // Save friends list into the user DB
    // var idList = [];
    // data.forEach(function(item) {
    //   idList.push(item.id);
    // })
    // facebook.updateFriendsList(idList);
  })

  $scope.doRefresh = function() {
    angular.element('.icon-refreshing').addClass('spin');
    facebook.getFriends($scope, userInfo).then(function(data) {
      $scope.friendsList = data;

      // Save friends list into the user DB
      // var idList = [];
      // data.forEach(function(item) {
      //   idList.push(item.id);
      // })
      // facebook.updateFriendsList(idList);

      $scope.$broadcast('scroll.refreshComplete');
      $timeout(function(){
        angular.element('.icon-refreshing').removeClass('spin');
      }, 500);
    }); 
  };

  $scope.friendPage = function(user) {
    if (typeof(user.picture) !== "string") {
      user.picture = user.picture.data.url;
    }
    usersInfos.singleUserInfoSet(user);
  }
}]);