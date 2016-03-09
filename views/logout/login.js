angular.module('myApp.login', ['myApp.env'])

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