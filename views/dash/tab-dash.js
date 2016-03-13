angular.module('myApp.dashTab', ['myApp.env'])

.controller('DashCtrl', function($ionicPlatform, $scope, Post, $timeout, $rootScope, $ionicModal, $ionicSlideBoxDelegate) {

  $scope.posts;
  $scope.aImages;

  $rootScope.$on('dashRefresh', function() {
    $scope.doRefresh();
  });

  // Post.getAllPosts().then(function(postsData) {
  //   console.log('Dash Get Post');
  //   delete postsData.connected;
  //   $scope.posts = postsData;
  // });

  $scope.doRefresh = function() {
    angular.element('.icon-refreshing').addClass('spin');
    $scope.noMoreData = false;
    $scope.currentLastPost = null;
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
    // animation: 'slide-in-up'
    animation: 'mh-slide'

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

    $scope.noMoreData = false;
    $scope.currentLastPost;
    var counterTest = 0;
    //     counterTest++;
    // if (counterTest >= 1) {
    //     $scope.noMoreData = false;
    // }

    // $scope.loadMore = function() {
    //   console.log('load more data');
    // }

    $scope.loadMore = function() {
      if (!$scope.currentLastPost) {
          Post.getAllPosts().then(function(postsData) {
            console.log('first load');
            delete postsData.connected;
            for (var first in postsData) {
              $scope.currentLastPost = postsData[first].time;
              break;
            }
            $scope.posts = postsData;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      } else {
        Post.getAllPostsInfinite($scope.currentLastPost).then(function(postsData) {
          var currentLastPostTemp;
          console.log('load more infinite');
          delete postsData.connected;
          for (var first in postsData) {
              currentLastPostTemp = postsData[first].time;
              break;
            }

          if ($scope.currentLastPost === currentLastPostTemp) {
            $scope.noMoreData = true;
          } else {
            $scope.currentLastPost = currentLastPostTemp;
            console.log(postsData);
            var updatedPost = angular.extend({}, $scope.posts, postsData)
            $scope.posts = updatedPost;
          }


          // for (var first in postsData) {
          //   $scope.currentLastPost = postsData[first].time;
          //   break;
          // }


          // console.log(postsData);
          // var updatedPost = angular.extend({}, $scope.posts, postsData)
          // $scope.posts = updatedPost;
          //     counterTest++;
          // if (counterTest >= 2) {
          //     $scope.noMoreData = false;
          // }
          $scope.$broadcast('scroll.infiniteScrollComplete');
      });
      }
  };

  // $scope.$on('$stateChangeSuccess', function() {
  //   console.log('routeing');
  //   $scope.loadMore();
  // });


});