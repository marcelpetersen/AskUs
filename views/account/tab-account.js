angular.module('myApp.acountTab', ['myApp.env'])

.controller('AccountCtrl', ['$scope', 'userAuth', 'currentUserInfos', 'usersInfos', function($scope, userAuth, currentUserInfos, usersInfos) {

  $scope.user = currentUserInfos.currentUserInfoGet();
  console.log($scope.user)

  $scope.logoutFacebook = function() {
    userAuth.logoutFacebook();
  };

 $('.account-tab-user').on('click', function(e){
  console.log(e.currentTarget);
 });

  $('.account-tab-user h2').on('click', function(e){
    e.stopPropagation();
    console.log(e.currentTarget);
 });
  $('.user-pic').on('click', function(e){
    e.stopPropagation();
    console.log(e.currentTarget);
 });

  $scope.userPage = function(userId, userName, userPicture) {
    var user = {
      id: userId,
      name: userName,
      picture: userPicture
    };
    usersInfos.singleUserInfoSet(user);
  };

}]);