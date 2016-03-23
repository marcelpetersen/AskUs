angular.module('myApp.acountTab', ['myApp.env'])

.controller('AccountCtrl', ['$scope', 'userAuth', 'currentUserInfos', 'usersInfos', function($scope, userAuth, currentUserInfos, usersInfos) {

  $scope.user = currentUserInfos.currentUserInfoGet();
  console.log($scope.user)

  $scope.logoutFacebook = function() {
    userAuth.logoutFacebook();
  };


  $scope.userPage = function(userId, userName, userPicture) {
    var user = {
      id: userId,
      name: userName,
      picture: userPicture
    };
    usersInfos.singleUserInfoSet(user);
  };

}]);