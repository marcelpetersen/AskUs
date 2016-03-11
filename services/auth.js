angular.module('myApp.authService', [])

.factory('Auth', function(rootRef, $firebaseAuth) {
  return $firebaseAuth(rootRef);
})

.factory('userAuth', function(Auth, $http, $localstorage, $state, FirebaseUrl, $window) {

  var isAuth = function() {
    return !!$localstorage.get('firebase:session::ionic-fboauth');
  };

  var loginWithFacebook = function() {
    Auth.$authWithOAuthPopup('facebook',{rememberMe: true, scope: 'email, user_friends'})
    .then(function(authData) {

      var userDataToSave = authData.facebook;
      var firebase = new Firebase(FirebaseUrl + '/');
      var userRef = firebase.child("users/" + authData.facebook.id );
      // Previous
      // var userRef = firebase.child("users/");

      // Check if the user exist in the DB
      userRef.orderByChild("id").equalTo(authData.facebook.id).once("value", function(snapshot) {
        console.log(snapshot.exists());
        if (!snapshot.exists()) {
          // Create new user in the database
          // ******** Previous used push() *********
          userRef.set(userDataToSave, function(error, authData) {
            if (error) {
              console.log("saving Failed!", error);
            } else {
              console.log('saving ok');
            }
          });
        } else {
          console.log('user already exists');
        }
      });
      $state.go('tab.dash');
    });
  };

  var logoutFacebook = function() {
    Auth.$unauth();
    $window.location.href = '#/splash';
  };

  var suspendAccountFacebook = function() {
    Auth.$unauth();
    FB.api('/me/permissions', 'delete', function(response) {
      console.log(response);
    });
    $window.location.href = '#/splash';
  };

  return {
    isAuth: isAuth,
    loginWithFacebook: loginWithFacebook,
    logoutFacebook: logoutFacebook,
    suspendAccountFacebook: suspendAccountFacebook
  };

});


