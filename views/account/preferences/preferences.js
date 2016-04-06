angular.module('myApp.preferences', ['myApp.env'])

.controller('preferencesCtrl', ['$scope', 'userAuth', 'currentUserInfos', function($scope, userAuth, currentUserInfos) {

  var pageName = "#preferences-page";
  angular.element(pageName + " .loading").hide();
  var userInfos = currentUserInfos.currentUserInfoGet();

  $scope.suspendAccountFacebook = function() {
    angular.element(pageName + " .loading").show();
    angular.element(pageName +' .loading-icon').addClass('spin');
    angular.element(pageName + ' .button.suspend').prop("disabled",true);
    userAuth.suspendAccountFacebook(userInfos.id).then(function(response) {
      // console.log(response);
      angular.element(pageName + " .loading").hide();
      angular.element(pageName +' .loading-icon').removeClass('spin');
      angular.element(pageName + ' .button.suspend').prop("disabled",false);
    }, function(error) {
      console.log(error);
      angular.element(pageName + " .loading").hide();
      angular.element(pageName +' .loading-icon').removeClass('spin');
      angular.element(pageName + ' .button.suspend').prop("disabled",false);
      if (error.data.error === "no such user") {
        userAuth.logoutFacebook();
      } else {
        $scope.openErrorModal();
      }
    });
  };

}]);