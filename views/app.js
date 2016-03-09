// Ionic App

angular.module('myApp', [
  'ionic',
  'firebase',
  'myApp.acountTab',
  'myApp.splash',
  'myApp.chatsTab',
  'myApp.chat',
  'myApp.dashTab',
  'myApp.friends',
  'myApp.login',
  'myApp.services',
  'myApp.env',
  'myApp.authService',
  'myApp.routingService'
])


.constant('FirebaseUrl', 'https://ionic-fboauth.firebaseio.com/')
.service('rootRef', ['FirebaseUrl', Firebase])
.run(function($ionicPlatform, $window, FBAppId, userAuth, $rootScope, $state) { 
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // Redirect the user if authenticate
    if (userAuth.isAuth()){ 
      // $state.go("tab.dash"); 
    } else {
      $state.go("splash");
    }
  });

  //stateChange event
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.authRequired && !userAuth.isAuth()){ //Assuming the AuthService holds authentication logic
      // User isn’t authenticated
      console.log('Please Login');
      $state.go("splash");
      event.preventDefault(); 
    }
  });

  // Facebook Init
  FB.init({ 
    appId: FBAppId,
    status: true, 
    cookie: true, 
    xfbml: true,
    version: 'v2.5'
  });

  //   $window.fbAsyncInit = function() {
  //     FB.init({ 
  //       appId: '743485582448268',
  //       status: true, 
  //       cookie: true, 
  //       xfbml: true,
  //       version: 'v2.5'
  //     });
  // };
});
