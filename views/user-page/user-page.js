angular.module('myApp.userPage', ['myApp.env'])

.controller('userPageCtrl', ['$scope', '$stateParams', 'usersInfos', 'Post', '$timeout', '$ionicModal', '$ionicSlideBoxDelegate', function($scope, $stateParams, usersInfos, Post, $timeout, $ionicModal, $ionicSlideBoxDelegate) {
  // $scope.chat = Chats.get($stateParams.chatId);
  $scope.posts;
  $scope.noPost = false;
  $scope.user = usersInfos.singleUserInfoGet();
  angular.element('.loading-icon').addClass('spin');

  Post.getPostsById($scope.user.id).then(function(postsData) {
    if (!!postsData) {
      $scope.posts = postsData;
    } else {
      $scope.noPost = true;
    }
    angular.element('.loading-icon').hide().removeClass('spin');
    angular.element('.loading').hide();
    angular.element('ion-infinite-scroll').css('margin-top', '0px');
  })

  $scope.doRefresh = function() {
    angular.element('.icon-refreshing').addClass('spin');
    Post.getPostsById($scope.user.id).then(function(postsData) {
      if (!!postsData) {
        $scope.posts = postsData;
      } else {
        $scope.noPost = true;
      }

      $scope.$broadcast('scroll.refreshComplete');
      $timeout(function(){
        angular.element('.icon-refreshing').removeClass('spin');
      }, 500);
    }); 
  };

  $scope.userPage = function(userId, userName, userPicture) {
    var user = {
      id: userId,
      name: userName,
      picture: userPicture
    }
    console.log(user);
    usersInfos.singleUserInfoSet(user);
  }

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


}]);