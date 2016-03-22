angular.module('myApp.mainController', [])

.controller('MainCtrl', ['$scope', '$rootScope', '$ionicModal', function($scope, $rootScope, $ionicModal) {
  //$scope.categoriesList = Categories.getCategoriesList();


  $ionicModal.fromTemplateUrl('error-modal.html', {
    scope: $scope,
    animation: 'mh-slide' //'slide-in-up'
  }).then(function(modal) {
    $scope.errorModal = modal;
  });

  $scope.openErrorModal = function() {
    $scope.errorModal.show();
  };

  $scope.closeErrorModal = function() {
    $scope.errorModal.hide();
  };

  $rootScope.$on('errorModal', function() {
    $scope.openErrorModal();
  })



}]);