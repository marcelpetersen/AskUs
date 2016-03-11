angular.module('myApp.authService', [])

.factory('userAuth', function(Auth, $http, $localstorage, $state, currentUserInfos) {

  var isAuth = function() {
    return !!$localstorage.get('firebase:session::ionic-fboauth');
  };

  var loginWithFacebook = function() {
    Auth.$authWithOAuthPopup('facebook',{rememberMe: true, scope: 'email, user_friends'})
    .then(function(authData) {
      console.log('auth data', authData);
      // currentUserInfos.currentUserInfoSet(authData.facebook);
      $state.go('tab.dash');
    });
  };

  var logoutFacebook = function() {
    Auth.$unauth();
    $state.go('splash');
  };

  var suspendAccountFacebook = function() {
    Auth.$unauth();
    FB.api('/me/permissions', 'delete', function(response) {
      console.log(response);
    });
    $state.go('tab.dash');
  };

  return {
    isAuth: isAuth,
    loginWithFacebook: loginWithFacebook,
    logoutFacebook: logoutFacebook,
    suspendAccountFacebook: suspendAccountFacebook
  };

});