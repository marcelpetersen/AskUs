angular.module('starter.controllers', ['myApp.env'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

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
})

.controller('LoginCtrl', function(Auth, $state, $localstorage) {

  this.loginWithFacebook = function loginWithFacebook() {
    Auth.$authWithOAuthPopup('facebook',{rememberMe: true, scope: 'email, user_friends'})
      .then(function(authData) {
        console.log('auth data', authData);
        $state.go('tab.friends');
      });
  };

    this.logoutFacebook = function logoutFacebook() {
      Auth.$unauth();
      // FB.api('/me/permissions', 'delete', function(response) {
      //   console.log(response);
      // })
      $state.go('tab.dash');
  };

    this.suspendAccountFacebook = function suspendAccountFacebook() {
      Auth.$unauth();
      FB.api('/me/permissions', 'delete', function(response) {
        console.log(response);
      })
      $state.go('tab.dash');
  };
});
