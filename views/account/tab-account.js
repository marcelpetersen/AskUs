angular.module('myApp.acountTab', ['myApp.env'])

.controller('AccountCtrl', function($scope, userAuth, currentUserInfos) {

  console.log(currentUserInfos.currentUserInfoGet());

  $scope.currentUser = currentUserInfos.currentUserInfoGet();

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

});