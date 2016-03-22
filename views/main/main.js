angular.module('myApp.mainController', [])

.controller('MainCtrl', ['$scope', '$rootScope', '$ionicModal', 'Categories', function($scope, $rootScope, $ionicModal, Categories) {
  // Show all the menu side categories
  $scope.categoriesList = Categories.getCategoriesList();

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

  $ionicModal.fromTemplateUrl('no-post-modal.html', {
    scope: $scope,
    animation: 'mh-slide' //'slide-in-up'
  }).then(function(modal) {
    $scope.noPostModal = modal;
  });

  $scope.openNoPostModal = function() {
    $scope.noPostModal.show();
  };

  $scope.closeNoPostModal = function() {
    $scope.noPostModal.hide();
  };

  $rootScope.$on('noPostModal', function() {
    $scope.openNoPostModal();
  })



}]);