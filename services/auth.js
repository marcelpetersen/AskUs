angular.module('myApp.authService', [])

.factory('Auth', ['rootRef', '$firebaseAuth', function(rootRef, $firebaseAuth) {
  return $firebaseAuth(rootRef);
}])

.factory('userAuth', ['Auth', '$http', '$localstorage', '$state', 'FirebaseUrl', '$window', 'currentUserInfos', function(Auth, $http, $localstorage, $state, FirebaseUrl, $window, currentUserInfos) {

  var isAuth = function() {
    return !!$localstorage.get('firebase:session::ionic-fboauth');
  };

  var loginWithFacebook = function() {
    Auth.$authWithOAuthPopup('facebook',{rememberMe: true, scope: 'email, user_friends'})
    .then(function(authData) {

      var userDataToSave = authData.facebook;
      var firebase = new Firebase(FirebaseUrl + '/');
      // ********* Previous *********
      // var userRef = firebase.child("users/" + authData.facebook.id);
      var userRef = firebase.child("users/");

      // Check if the user exist in the DB
      userRef.orderByChild("id").equalTo(authData.facebook.id).once("value", function(snapshot) {
        console.log(snapshot.exists());
        if (!snapshot.exists()) {
          // Create new user in the database
          // ******** Previous used push() otherwise set() *********
          userRef.push(userDataToSave, function(error, authData) {
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
    // Remove facebook stored cookies
    window.cookies.clear(function() {
      //$window.location.reload();
      $window.location.href = '#/splash';   
    });
  };

  var suspendAccountFacebook = function() {
    //Get FB access token for removeing app permission
    var currentUser = currentUserInfos.currentUserInfoGet();
    var currentUserFBToken = currentUser.accessToken;

    FB.api('/me/permissions?access_token=' + currentUserFBToken, 'delete', function(response) {
      console.log(response);
      Auth.$unauth();
      // TODO DELETE ACCOUNT AND POST
      // $window.location.href = '#/splash';
      window.cookies.clear(function() {
        //$window.location.reload();
        $window.location.href = '#/splash';   
      });
    });
  };

  return {
    isAuth: isAuth,
    loginWithFacebook: loginWithFacebook,
    logoutFacebook: logoutFacebook,
    suspendAccountFacebook: suspendAccountFacebook
  };

}]);


