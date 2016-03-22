angular.module('myApp.mainController', [])

.controller('MainCtrl', ['$scope', '$rootScope', '$ionicModal', 'Categories', '$ionicSlideBoxDelegate', 'Post', function($scope, $rootScope, $ionicModal, Categories, $ionicSlideBoxDelegate, Post) {
  // Show all the menu side categories
  $scope.categoriesList = Categories.getCategoriesList();

  $scope.modalPictureUpdate =  function(data) {
    $scope.aImages = [{
      'src': data.pictureA
    }, {
      'src': data.pictureB
    }];
  };

  // $scope.postDelete = {};
  $scope.postReport = {};

  $scope.reportPost = function(id) {
    Post.reportPost(id).then(function(){
      // angular.element(pageName +' .card[data-postid='+ id +']').fadeOut(500);
      $scope.reportModal.hide();
    }, function(){
      $scope.reportModal.hide();
      console.log("report failed");
      // Show global error modal
      $scope.openErrorModal();
    })
  };

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

  // $ionicModal.fromTemplateUrl('post-delete-modal.html', {
  //   scope: $scope,
  //   animation: 'mh-slide' //'slide-in-up'
  // }).then(function(modal) {
  //   $scope.deleteModal = modal;
  // });

  // $scope.showDeleteModal = function(key, title) {
  //   $scope.postDelete.title = title;
  //   $scope.postDelete.id = key;
  //   $scope.deleteModal.show();
  // };

  // $scope.closeDeleteModal = function() {
  //   $scope.deleteModal.hide();
  // };

  $ionicModal.fromTemplateUrl('post-report-modal.html', {
    scope: $scope,
    animation: 'mh-slide' //'slide-in-up'
  }).then(function(modal) {
    $scope.reportModal = modal;
  });

  $scope.showReportModal = function(key, title) {
    $scope.postReport.title = title;
    $scope.postReport.id = key;
    $scope.reportModal.show();
  };

  $scope.closeReportModal = function() {
    $scope.reportModal.hide();
  };

  $ionicModal.fromTemplateUrl('image-modal.html', {
    scope: $scope,
    animation: 'mh-slide' //'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $ionicSlideBoxDelegate.slide(0);
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.goToSlide = function(index) {
    $scope.modal.show();
    $ionicSlideBoxDelegate.slide(index);
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };



}]);