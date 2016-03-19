angular.module('myApp.dashTab', ['myApp.env'])

.controller('DashCtrl', 
  ['$scope', '$ionicSideMenuDelegate', 'Post', '$timeout', '$rootScope', '$ionicModal', '$ionicSlideBoxDelegate', 'usersInfos', 'Vote', 'currentUserInfos', 
  function($scope, $ionicSideMenuDelegate, Post, $timeout, $rootScope, $ionicModal, $ionicSlideBoxDelegate, usersInfos, Vote, currentUserInfos) {

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

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
          // Get the previous last 5 posts
          Post.getAllPosts().then(function(postsData) {
            console.log('Load first data');

            // Delete the last element, will be added by the next loadmore call (Firebase returns the last element of the time range)
            var cleanedData = Post.getAndDeleteFirstElementInObject(postsData);
            $scope.currentLastPost = cleanedData.currentLastPost
            $scope.posts = cleanedData.obj;

            angular.element('.icon-refreshing').removeClass('spin');
            angular.element('ion-infinite-scroll').css('margin-top', '0px');
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      } else {
        Post.getAllPostsInfinite($scope.currentLastPost).then(function(postsData) {
          console.log('Loading more data');

          var firstElement = Post.getFirstElementInObject(postsData);
          var currentLastPostTemp = firstElement.currentLastPost;
          var lastPostId = firstElement.id;

          if ($scope.currentLastPost === currentLastPostTemp) {
            $scope.noMoreData = true;
            var updatedPostFinal = angular.extend({}, $scope.posts, postsData)
            $scope.posts = updatedPostFinal;
          } else {
            $scope.currentLastPost = currentLastPostTemp;
            // Delete the element because already exist in the original Data
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
    angular.element('.card[data-postid='+ post.$key +'] .vote-loading .loading-icon').addClass('spin');
    angular.element('.card[data-postid='+ post.$key +'] .vote-loading').removeClass('hide');
    Vote.addVote(post.$key, element).then(function(){
      angular.element('.card[data-postid='+ post.$key +'] .vote-loading .loading-icon').removeClass('spin');

      angular.element('.card[data-postid='+ post.$key +']').addClass('voted voted-'+ element);

      // Hide voting button block and show radials
      post.hasVoted = true;

      // Keep for now
      // angular.element('.card[data-postid='+ post.$key +'] .vote-buttons-container').hide();
      // angular.element('.card[data-postid='+ post.$key +'] .results-container').fadeIn();

      (element === "A") ? post.voteATotal++ : post.voteBTotal++;

      post.totalA = Vote.calculTotalRatio(post.voteATotal, post.voteBTotal);
      post.totalB = Vote.calculTotalRatio(post.voteBTotal, post.voteATotal);

      // Create the Radials
      Vote.addRadial("A", post.$key, '#33cd5f', post.totalA, 1000);
      Vote.addRadial("B", post.$key, '#387ef5', post.totalB, 1000);

    }, function(){
      angular.element('.card[data-postid='+ post.$key +'] .vote-loading').addClass('hide');
      angular.element('.card[data-postid='+ post.$key +'] .vote-loading .loading-icon').removeClass('spin');
      console.log("vote failed");
    })
  };

  $scope.checkVote = function(post) {
    var currentUser = currentUserInfos.currentUserInfoGet();
    // Check if user has vote this post
    if (post.voters) {
      if (post.voters[currentUser.id]) {
        post.totalA = Vote.calculTotalRatio(post.voteATotal, post.voteBTotal);
        post.totalB = Vote.calculTotalRatio(post.voteBTotal, post.voteATotal);
        // Timeout required for updating the view and render the radials
        $timeout(function(){
          //Show Radial block hide Buttons
          post.hasVoted = true;
          angular.element('.card[data-postid='+ post.$key +']').addClass('voted voted-'+ post.voters[currentUser.id]);

          // Keep for now
          // angular.element('.card[data-postid='+ post.$key +'] .vote-buttons-container').hide();
          // angular.element('.card[data-postid='+ post.$key +'] .results-container').show();
          Vote.addRadial("A", post.$key, '#33cd5f', post.totalA, 1);
          Vote.addRadial("B", post.$key, '#387ef5', post.totalB, 1);
        }, 0);    
      }
    }
    // check if user own post
    if (post.userId === currentUser.id) {
      $timeout(function(){
        angular.element('.card[data-postid='+ post.$key +']').addClass('my-post');
      }, 0);
    }
  };

  $scope.deletePost = function(id) {
    Post.deletePost(id).then(function(){
      angular.element('.card[data-postid='+ id +']').fadeOut(500);
      $scope.deleteModal.hide();
    }, function(){
      $scope.deleteModal.hide();
      console.log("delete failed");
    })
  }

  // ****** Modal functions ******
  $scope.modalPictureUpdate =  function(data) {
    $scope.aImages = [{
      'src': data.pictureA
    }, {
      'src': data.pictureB
    }];
  };

  $scope.postDelete = {};

  $ionicModal.fromTemplateUrl('post-delete-modal.html', {
    scope: $scope,
    animation: 'mh-slide' //'slide-in-up'
  }).then(function(modal) {
    $scope.deleteModal = modal;
  });

  $ionicModal.fromTemplateUrl('image-modal.html', {
    scope: $scope,
    animation: 'mh-slide' //'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.showDeleteModal = function(key, title) {
    $scope.postDelete.title = title;
    $scope.postDelete.id = key;
    $scope.deleteModal.show();
  };

  $scope.closeDeleteModal = function() {
    $scope.deleteModal.hide();
  };

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