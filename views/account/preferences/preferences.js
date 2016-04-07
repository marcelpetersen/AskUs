angular.module('AskUs.preferences', ['AskUs.env'])

.controller('preferencesCtrl', ['$scope', 'userAuth', 'currentUserInfos', '$ionicModal', function($scope, userAuth, currentUserInfos, $ionicModal) {

  var pageName = "#preferences-page";
  angular.element(pageName + " .loading").hide();
  var userInfos = currentUserInfos.currentUserInfoGet();

  $scope.suspendAccountFacebook = function() {
    $scope.closeSuspendModal();
    angular.element(pageName + " .loading").show();
    angular.element(pageName +' .loading-icon').addClass('spin');
    angular.element(pageName + ' .button.suspend').prop("disabled",true);
    userAuth.suspendAccountFacebook(userInfos.id).then(function(response) {
      console.log("account and posts deleted");
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

  // ****** Modal functions ******
  $ionicModal.fromTemplateUrl('suspend-account-modal.html', {
    scope: $scope,
    animation: 'mh-slide' //'slide-in-up'
  }).then(function(modal) {
    $scope.suspendModal = modal;
  });

  $scope.showDeleteModal = function(key, title) {
    $scope.suspendModal.show();
  };

  $scope.closeSuspendModal = function() {
    $scope.suspendModal.hide();
  };

}]);