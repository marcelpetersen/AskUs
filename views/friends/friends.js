angular.module('myApp.friends', ['myApp.env'])

.controller('friendsCtrl', function($scope, $localstorage, facebook, $timeout) {
  $scope.noFriend = false;
  $scope.friendsList;
    console.log(angular.element(document.getElementsByClassName("text-pulling")));

  var userInfo = $localstorage.get('firebase:session::ionic-fboauth');

  facebook.getFriends($scope, userInfo);

  $scope.doRefresh = function() {
    facebook.getFriends($scope, userInfo);
    angular.element('.text-pulling').addClass('hidden');
    angular.element('.icon-pulling').addClass('hidden');
    // $timeout(function(){
    //   $scope.$broadcast('scroll.refreshComplete');
    // }, 400);    
  };

  $scope.$on('scroll.refreshComplete', function() {
      angular.element('.text-pulling').removeClass('hidden');
      angular.element('.icon-pulling').removeClass('hidden');
  });
});