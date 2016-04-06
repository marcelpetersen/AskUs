angular.module('myApp.dashFilterTab', ['myApp.env'])

.controller('DashFilterCtrl', 
  ['$scope', '$stateParams', '$state', '$ionicSideMenuDelegate', 'Categories', 'Post', '$timeout', '$rootScope', '$ionicModal', '$ionicSlideBoxDelegate', 'usersInfos', 'Vote', 'currentUserInfos', 
  function($scope, $stateParams, $state, $ionicSideMenuDelegate, Categories, Post, $timeout, $rootScope, $ionicModal, $ionicSlideBoxDelegate, usersInfos, Vote, currentUserInfos) {

  var pageName = '#dash-filter-page';
  $scope.pageOriginName = 'dash';
  $scope.posts;
  $scope.aImages;
  $scope.noMoreData = false;
  $scope.postDelete = {};

  var newPostLimit = 6;
  var postTotalMax = 0;
  var totalPostNumber = 0;
  var totalPost;
  var displayedPost;

  // Get route parent
  $scope.parentCategory = $stateParams.filter;

  // Close menu
  $ionicSideMenuDelegate.toggleLeft(false);

  // Check the Post to delete and update when coming back to the page
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
     if (toState.name === "tab.dash-filter") {
        Vote.voteUpdate("dash-filter-page");
        Post.postToDelete("dash-filter-page");
     }
  });

  $scope.doRefresh = function() {
    angular.element(pageName +' .icon-refreshing').addClass('spin');
    // Reset all data
    // $scope.noMoreData = false;
    // $scope.posts = {};
    newPostLimit = 6;
    postTotalMax = 0;
    totalPostNumber = 0;
    totalPost;
    displayedPost;

    Categories.getAllPostsByCategory($stateParams.filter, newPostLimit).then(function(postsData) {
      // Increase the total possible number of posts displayed
      postTotalMax += newPostLimit;

      totalPostNumber = postsData.number;
      if (totalPostNumber === 0 || postsData.number < postTotalMax) {
        $scope.noMoreData = true;
      }
      $scope.posts = postsData.values;
      $scope.$broadcast('scroll.refreshComplete');
      $timeout(function(){
        // BUG: If User find the last card, refreshing call loadmore() until it had all card
        // Limit to 2 extra calls
        $scope.noMoreData = false;
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
      }, 500);
    }, function() {
      // Show global error modal
      $scope.openErrorModal();
      $scope.noMoreData = true;
      $scope.$broadcast('scroll.refreshComplete');
      $timeout(function(){
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
      }, 500);
    });
  };

  $scope.loadMore = function() {
    angular.element(pageName +' .icon-refreshing').addClass('spin');
    if (totalPostNumber === 0) {
      angular.element(pageName +' ion-infinite-scroll').css('margin-top', ((screen.height / 2) - 90) + 'px');
      // Get the previous last 5 posts
      Categories.getAllPostsByCategory($stateParams.filter, newPostLimit).then(function(postsData) {
        // Increase the total possible number of posts displayed
        postTotalMax += newPostLimit;
        // Check the number of cards retreive
        totalPostNumber = postsData.number;
        if (totalPostNumber === 0 || postsData.number < postTotalMax) {
          $scope.noMoreData = true;
        }

        $scope.posts = postsData.values;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
        angular.element(pageName +' ion-infinite-scroll').css('margin-top', '0px');
      }, function() {
        // Show global error modal
        $scope.openErrorModal();
        $scope.noMoreData = true;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
        angular.element(pageName +' ion-infinite-scroll').css('margin-top', '0px');
      });

    } else {
      Categories.getAllPostsByCategoryInfinite($stateParams.filter, totalPostNumber, newPostLimit).then(function(postsData) {
        postTotalMax += newPostLimit;
        totalPostNumber = postsData.number;
        var newObjToAdd;
        var updatedPost;
        // Less posts than the max possible, then the is no more post available
        if( postsData.number !== postTotalMax ) {
          $scope.noMoreData = true;
          newObjToAdd = Categories.getFirstXElements(postsData.values , newPostLimit - (postTotalMax - postsData.number))
        } else {
          newObjToAdd = Categories.getFirstXElements(postsData.values , newPostLimit)
        }
        updatedPost = angular.extend({}, $scope.posts, newObjToAdd);
        $scope.posts = updatedPost;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
      }, function() {        
        // Show global error modal
        $scope.openErrorModal();
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.noMoreData = true;
        angular.element(pageName +' .icon-refreshing').removeClass('spin');
      })
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

  // ****** Vote functions ******
  $scope.vote = function(post, element) {
    angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading .loading-icon').addClass('spin');
    angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading').removeClass('hide');
    Vote.addVote(post.$key, element).then(function(){
      angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading .loading-icon').removeClass('spin');
      angular.element(pageName +' .card[data-postid='+ post.$key +']').addClass('voted voted-'+ element);

      // Hide voting button block and show radials
      post.hasVoted = true;

      // Increase votes and get the ratios
      (element === "A") ? post.voteATotal++ : post.voteBTotal++;
      post.totalA = Vote.calculTotalRatio(post.voteATotal, post.voteBTotal);
      post.totalB = Vote.calculTotalRatio(post.voteBTotal, post.voteATotal);

      // Add post to the update list for the Dash page
      Vote.addVoteToUpdate("dash-page", post.$key, element, post.totalA, post.totalB);

      // Create the Radials
      Vote.addRadial("A", post.$key, '#33cd5f', post.totalA, 1000, pageName);
      Vote.addRadial("B", post.$key, '#387ef5', post.totalB, 1000, pageName);

    }, function(error){
      angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading').addClass('hide');
      angular.element(pageName +' .card[data-postid='+ post.$key +'] .vote-loading .loading-icon').removeClass('spin');
      console.log("vote failed");
      if (error.noPost) {
        $scope.openNoPostModal();

        // Add post to the delete list for the Dash & Dash Filter & user pages
        Post.addPostToDelete("dash-page", post.$key);
        Post.addPostToDelete("user-page", post.$key);
        Post.addPostToDelete("my-votes-page", post.$key);

        angular.element(pageName +' .card[data-postid='+ post.$key +']').fadeOut();
      } else {
        // Show global error modal
        $scope.openErrorModal();
      }
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
          angular.element(pageName +' .card[data-postid='+ post.$key +']').addClass('voted voted-'+ post.voters[currentUser.id]);

          Vote.addRadial("A", post.$key, '#33cd5f', post.totalA, 1, pageName);
          Vote.addRadial("B", post.$key, '#387ef5', post.totalB, 1, pageName);
        }, 0);    
      }
    }
    // check if user own post
    if (post.userId === currentUser.id) {
      $timeout(function(){
        angular.element(pageName +' .card[data-postid='+ post.$key +']').addClass('my-post');
      }, 0);
    }
  };

  $scope.deletePost = function(id) {
    Post.deletePost(id).then(function(){
      angular.element(pageName +' .card[data-postid='+ id +']').fadeOut(500);
      $scope.deleteModal.hide();

      // Add post to the delete list for the Dash & Dash Filter & user pages
      Post.addPostToDelete("dash-page", id);
      //Post.addPostToDelete("dash-filter-page", id);
      Post.addPostToDelete("my-votes-page", id);
      Post.addPostToDelete("user-page", id);

    }, function(){
      $scope.deleteModal.hide();
      console.log("delete failed");
      // Show global error modal
      $scope.openErrorModal();
    })
  };

  $ionicModal.fromTemplateUrl('post-delete-modal.html', {
    scope: $scope,
    animation: 'mh-slide' //'slide-in-up'
  }).then(function(modal) {
    $scope.deleteModal = modal;
  });

  $scope.showDeleteModal = function(key, title) {
    $scope.postDelete.title = title;
    $scope.postDelete.id = key;
    $scope.deleteModal.show();
  };

  $scope.closeDeleteModal = function() {
    $scope.deleteModal.hide();
  };

}]);