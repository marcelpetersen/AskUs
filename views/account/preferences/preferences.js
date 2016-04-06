angular.module('myApp.preferences', ['myApp.env'])

.controller('preferencesCtrl', ['$scope', 'userAuth', 'currentUserInfos', function($scope, userAuth, currentUserInfos) {
  $scope.settings = {
    enableNotifications: true
  };

  var userInfos = currentUserInfos.currentUserInfoGet();

  $scope.suspendAccountFacebook = function() {
    userAuth.suspendAccountFacebook(userInfos.id).then(function(response) {
      console.log(response);
    }, function(error) {
      console.log(error);
      $scope.openErrorModal();
    });
  };

}]);