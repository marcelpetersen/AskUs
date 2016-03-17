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
            delete postsData.connected;
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
            // $scope.$broadcast('scroll.infiniteScrollComplete');
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

  $scope.vote = function(post, element) {
    Vote.addVote(post.$key, element).then(function(){
      console.log("vote saved");
      angular.element('.card[data-postid='+ post.$key +']').addClass('voted voted-'+ element);
      angular.element('.card[data-postid='+ post.$key +'] .vote-buttons-container').hide();
      angular.element('.card[data-postid='+ post.$key +'] .results-container').fadeIn();

      var totalA = post.voteATotal;
      var totalB = post.voteBTotal;
      // var total = totalVote;
      var total = totalA + totalB + 1;

      if (element === "A") {
        totalA++;
      } else {
        totalB++;
      }

      post.totalA = Math.round(totalA * 100 /(total));
      post.totalB = Math.round(totalB * 100 /(total));
      console.log(post.totalA, post.totalB)

      // post.totalA = 30;
      // post.totalB = 70;

      var a = new RadialProgressChart('.results-A[data-postid='+ post.$key +']', {
        diameter: 70,
        max: 100,
        round: false,
        series: [{
          value: post.totalA,
          color: '#33cd5f'
        }],
        animation: {
            duration: 2500
        },
         shadow: {
        width: 0
    },
        stroke: {
            width: 20,
            gap: 2
        },
        center: function(d) {
          return post.totalA + ' %'
        }
      });

      var b = new RadialProgressChart('.results-B[data-postid='+ post.$key +']', {
        diameter: 70,
        max: 100,
        round: false,
        series: [{
          value: post.totalB,
          color: '#387ef5'
        }],
         shadow: {
        width: 0
    },
        stroke: {
            width: 20,
            gap: 2
        },
        animation: {
            duration: 2500
        },
        center: function(d) {
          return post.totalB + ' %'
        }
      });

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