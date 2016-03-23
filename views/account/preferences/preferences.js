angular.module('myApp.preferences', ['myApp.env'])

.controller('preferencesCtrl', ['$scope', 'userAuth', function($scope, userAuth) {
    $scope.settings = {
    enableNotifications: true
  };

  $scope.suspendAccountFacebook = function() {
    userAuth.suspendAccountFacebook();
  };

}]);