angular.module('myApp.friends', ['myApp.env'])

.controller('friendsCtrl', function($scope, $localstorage) {
  $scope.noFriend = false;
  $scope.friendsList;

  var userInfo = $localstorage.get('firebase:session::ionic-fboauth');

  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    // FACEBOOK GET FRIENDS LIST
    FB.api(
      "/" + userInfo.facebook.id + "/friends?access_token=" + userInfo.facebook.accessToken + "&fields=name,id,email,picture",
      function (response) {
        if (response && !response.error) {
          $scope.friendsList = response.data;
          $scope.$apply();
          // console.log(response.data);
        } else {
          console.log('error', response.error)
        }
      }
    );
  } else {
    $scope.noFriend = true;
  }
});