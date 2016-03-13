angular.module('myApp.dashTab', ['myApp.env'])

.controller('DashCtrl', function($scope, Post, $timeout, $rootScope, $ionicModal, $ionicSlideBoxDelegate) {

  $scope.posts;
  $scope.aImages;

  console.log('Dash Ctrl First call');

  $rootScope.$on('dashRefresh', function() {
    $scope.doRefresh();
  });

  Post.getAllPosts().then(function(postsData) {
    console.log('Dash Get Post');
    delete postsData.connected;
    $scope.posts = postsData;
  });

  $scope.doRefresh = function() {
    angular.element('.icon-refreshing').addClass('spin');
    Post.getAllPosts().then(function(postsData) {
      delete postsData.connected;
      $scope.posts = postsData;

      $scope.$broadcast('scroll.refreshComplete');
      $timeout(function(){
        angular.element('.icon-refreshing').removeClass('spin');
      }, 500);
    }); 
  };

  $scope.modalPictureUpdate =  function(data) {
    $scope.aImages = [{
      'src': data.pictureA
    }, {
      'src': data.pictureB
    }];
  }

  $ionicModal.fromTemplateUrl('image-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
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
    }
  
    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };


});