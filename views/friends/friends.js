angular.module('myApp.friends', ['myApp.env'])

.controller('friendsCtrl', ['$scope', '$localstorage', 'facebook', '$timeout', 'usersInfos', function($scope, $localstorage, facebook, $timeout, usersInfos) {
  
  $scope.noFriend = false;
  $scope.friendsList;
  var pageName = "#friends-page";
  var userInfo = $localstorage.get('firebase:session::ionic-fboauth');

  // Animating the loader
  angular.element(pageName +' .loading').css('margin-top', ((screen.height / 2) - 90) + 'px');
  angular.element(pageName + ' .loading-icon').addClass('spin');

  // Get Facebook friends list
  facebook.getFriends($scope, userInfo).then(function(data) {
    $scope.friendsList = data;
    if (data.length === 0) {
      $scope.noFriend = true;
    }
    angular.element(pageName +' .loading-icon').removeClass('spin');
    angular.element(pageName +' .loading').hide();
  }, function() {
    // Show global error modal
    $scope.openErrorModal();
    angular.element(pageName +' .loading-icon').removeClass('spin');
    angular.element(pageName +' .loading').hide();
  });

  // Refresh friends list
  $scope.doRefresh = function() {
    angular.element('.icon-refreshing').addClass('spin');
    facebook.getFriends($scope, userInfo).then(function(data) {
      $scope.friendsList = data;

      $scope.$broadcast('scroll.refreshComplete');
      $timeout(function(){
        angular.element('.icon-refreshing').removeClass('spin');
      }, 500);
    }, function() {
      // Show global error modal
      $scope.openErrorModal();
    }); 
  };

  // Store friends infos before redirection
  $scope.friendPage = function(user) {
    if (typeof(user.picture) !== "string") {
      user.picture = user.picture.data.url;
    }
    usersInfos.singleUserInfoSet(user);
  }
}]);