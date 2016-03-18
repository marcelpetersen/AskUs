angular.module('myApp.dashTab', ['myApp.env'])

.controller('DashCtrl', 
  ['$scope', 'Post', '$timeout', '$rootScope', '$ionicModal', '$ionicSlideBoxDelegate', 'usersInfos', 'Vote', 'currentUserInfos', 
  function($scope, Post, $timeout, $rootScope, $ionicModal, $ionicSlideBoxDelegate, usersInfos, Vote, currentUserInfos) {

  $scope.posts;
  $scope.aImages;
  $scope.noMoreData = false;

  $rootScope.$on('dashRefresh', function() {
    $scope.doRefresh();
  });

  $scope.doRefresh = function() {
    angular.element('.icon-refreshing').addClass('spin');
    $scope.noMoreData = false;
    $scope.currentLastPost = null;
    // Get the last 5 posts
    Post.getAllPosts().then(function(postsData) {
      $scope.posts = postsData;
      $scope.$broadcast('scroll.refreshComplete');
      $timeout(function(){
        angular.element('.icon-refreshing').removeClass('spin');
      }, 500);
    }); 
  };

  $scope.currentLastPost;
  $scope.loadMore = function() {
    angular.element('.icon-refreshing').addClass('spin');
      if (!$scope.currentLastPost) {
          angular.element('ion-infinite-scroll').css('margin-top', ((screen.height / 2) - 90) + 'px');
          Post.getAllPosts().then(function(postsData) {
            console.log('Load first data');
          console.log(postsData);

            // delete postsData.connected;
            for (var first in postsData) {
              $scope.currentLastPost = postsData[first].time;
              delete postsData[first];
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
          var lastPostId;
          console.log('Loading more data');
          // delete postsData.connected;
          console.log(postsData);
          for (var first in postsData) {
            currentLastPostTemp = postsData[first].time;
            lastPostId = first;
            break;
          }
          if ($scope.currentLastPost === currentLastPostTemp) {
            console.log(postsData);
            $scope.noMoreData = true;
            var updatedPost = angular.extend({}, $scope.posts, postsData)
            $scope.posts = updatedPost;
          } else {
            $scope.currentLastPost = currentLastPostTemp;
            delete postsData[lastPostId];
            var updatedPost = angular.extend({}, $scope.posts, postsData)
            $scope.posts = updatedPost;
          }

        angular.element('.icon-refreshing').removeClass('spin');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }
  };

  // ****** Next page functions ******
  $scope.userPage = function(userId, userName, userPicture) {
    var user = {
      id: userId,
      name: userName,
      picture: userPicture
    };
    usersInfos.singleUserInfoSet(user);
  };

  $scope.postPage = function(uid, data) {
    var postData = {
      uid: uid,
      data: data
    };
    Post.singlePostInfoSet(postData);
  };

  // ****** Vote functions ******
  $scope.vote = function(post, element) {
    Vote.addVote(post.$key, element).then(function(){
      angular.element('.card[data-postid='+ post.$key +']').addClass('voted voted-'+ element);
      angular.element('.card[data-postid='+ post.$key +'] .vote-buttons-container').hide();
      angular.element('.card[data-postid='+ post.$key +'] .results-container').fadeIn();

      (element === "A") ? post.voteATotal++ : post.voteBTotal++;

      post.totalA = Math.round(post.voteATotal * 100 /(post.voteATotal + post.voteBTotal));
      post.totalB = Math.round(post.voteBTotal * 100 /(post.voteATotal + post.voteBTotal));

      Vote.addRadial("A", post.$key, '#33cd5f', post.totalA, 1000);
      Vote.addRadial("B", post.$key, '#387ef5', post.totalB, 1000);

    }, function(){
      console.log("vote failed");
    })
  };

  $scope.checkVote = function(postId, post) {
    var currentUser = currentUserInfos.currentUserInfoGet();
    if (post.voters) {
      if (post.voters[currentUser.id]) {
        post.totalA = Math.round(post.voteATotal * 100 /(post.voteATotal + post.voteBTotal));
        post.totalB = Math.round(post.voteBTotal * 100 /(post.voteATotal + post.voteBTotal));
        $timeout(function(){
          angular.element('.card[data-postid='+ post.$key +']').addClass('voted voted-'+ post.voters[currentUser.id]);
          angular.element('.card[data-postid='+ post.$key +'] .vote-buttons-container').hide();
          angular.element('.card[data-postid='+ post.$key +'] .results-container').show();
          Vote.addRadial("A", post.$key, '#33cd5f', post.totalA, 1);
          Vote.addRadial("B", post.$key, '#387ef5', post.totalB, 1);
        }, 0);    
      }
    }
  };

  // ****** Modal functions ******
  $scope.modalPictureUpdate =  function(data) {
    $scope.aImages = [{
      'src': data.pictureA
    }, {
      'src': data.pictureB
    }];
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