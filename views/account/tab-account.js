angular.module('AskUs.acountTab', ['AskUs.env'])

.controller('AccountCtrl', ['$scope', 'userAuth', 'currentUserInfos', 'usersInfos', function($scope, userAuth, currentUserInfos, usersInfos) {

  $scope.user = currentUserInfos.currentUserInfoGet();

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