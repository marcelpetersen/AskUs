angular.module('myApp.login', ['myApp.env'])

.controller('LoginCtrl', function(Auth, $state, $localstorage) {

  this.loginWithFacebook = function loginWithFacebook() {
    console.log('login');
    Auth.$authWithOAuthPopup('facebook',{rememberMe: true, scope: 'email, user_friends'})
      .then(function(authData) {
        console.log('auth data', authData);
        $state.go('tab.dash');
      });
  };

    this.logoutFacebook = function logoutFacebook() {
      Auth.$unauth();
      // FB.api('/me/permissions', 'delete', function(response) {
      //   console.log(response);
      // })
      $state.go('splash');
  };

    this.suspendAccountFacebook = function suspendAccountFacebook() {
      Auth.$unauth();
      FB.api('/me/permissions', 'delete', function(response) {
        console.log(response);
      })
      $state.go('tab.dash');
  };
});