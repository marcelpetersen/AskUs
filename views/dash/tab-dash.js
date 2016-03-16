angular.module('myApp.dashTab', ['myApp.env'])

.controller('DashCtrl', ['$scope', 'Post', '$timeout', '$rootScope', '$ionicModal', '$ionicSlideBoxDelegate', 'usersInfos', 'Vote', 'currentUserInfos', function($scope, Post, $timeout, $rootScope, $ionicModal, $ionicSlideBoxDelegate, usersInfos, Vote, currentUserInfos) {

  $scope.posts;
  $scope.aImages;

  $rootScope.$on('dashRefresh', function() {
    $scope.doRefresh();
  });

  $scope.doRefresh = function() {
    angular.element('.icon-refreshing').addClass('spin');
    $scope.noMoreData = false;
    $scope.currentLastPost = null;
    Post.getAllPosts().then(function(postsData) {
      // delete postsData.connected;
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

    $scope.loadMore = function() {
      angular.element('.icon-refreshing').addClass('spin');
      if (!$scope.currentLastPost) {
          angular.element('ion-infinite-scroll').css('margin-top', ((screen.height / 2) - 90) + 'px');
          Post.getAllPosts().then(function(postsData) {
            console.log('Load first data');
            // delete postsData.connected;
            for (var first in postsData) {
              $scope.currentLastPost = postsData[first].time;
              break;
            }
            $scope.posts = postsData;

            angular.element('.icon-refreshing').removeClass('spin');
            angular.element('ion-infinite-scroll').css('margin-top', '0px');
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      } else {
        Post.getAllPostsInfinite($scope.currentLastPost).then(function(postsData) {
          var currentLastPostTemp;
          console.log('Loading more data');
          delete postsData.connected;
          for (var first in postsData) {
            currentLastPostTemp = postsData[first].time;
            break;
          }

          if ($scope.currentLastPost === currentLastPostTemp) {
            $scope.noMoreData = true;
          } else {
            $scope.currentLastPost = currentLastPostTemp;
            var updatedPost = angular.extend({}, $scope.posts, postsData)
            $scope.posts = updatedPost;
          }

        angular.element('.icon-refreshing').removeClass('spin');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
      }
  };

  $scope.userPage = function(userId, userName, userPicture) {
    var user = {
      id: userId,
      name: userName,
      picture: userPicture
    };
    usersInfos.singleUserInfoSet(user);
  }

  $scope.postPage = function(uid, data) {
    var postData = {
      uid: uid,
      data: data
    };
    Post.singlePostInfoSet(postData);
  }

  $scope.vote = function(postId, userId, element) {
    Vote.addVote(postId, userId, element).then(function(){
      console.log("vote saved");
      angular.element('.card[data-postid='+ postId +']').addClass('voted voted-'+ element);
    }, function(){
      console.log("vote failed");
    })
  }


  $scope.checkVote = function(postId, post) {
    var currentUser = currentUserInfos.currentUserInfoGet();
    if (post.voters) {
        if (post.voters[currentUser.id]) {
          $timeout(function(){angular.element('.card[data-postid='+ postId +']').addClass('voted voted-'+ post.voters[currentUser.id]);}, 0);    
        }
    }

  }

}]);