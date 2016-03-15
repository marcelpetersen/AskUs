angular.module('myApp.acountTab', ['myApp.env'])

.controller('AccountCtrl', ['$scope', 'userAuth', 'currentUserInfos',function($scope, userAuth, currentUserInfos) {

  $scope.currentUser = currentUserInfos.currentUserInfoGet();
  // console.log($scope.currentUser.accessToken)

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

}]);