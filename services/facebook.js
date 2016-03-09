angular.module('myApp.facebookService', [])

.factory('facebook', function() {
  return {
    getFriends: function($scope, userDetail) {
        if (userDetail) {
          userDetail = JSON.parse(userDetail);
          // FACEBOOK GET FRIENDS LIST
          FB.api(
            "/" + userDetail.facebook.id + "/friends?access_token=" + userDetail.facebook.accessToken + "&fields=name,id,email,picture",
            function (response) {
              if (response && !response.error) {
                $scope.friendsList = response.data;
                $scope.$apply();                
                $scope.$broadcast('scroll.refreshComplete');
              } else {
                console.log('error', response.error)
                $scope.$broadcast('scroll.refreshComplete');
              }
            }
          );
        } else {
          $scope.noFriend = true;
          $scope.$broadcast('scroll.refreshComplete');
        }
    }
  }
});