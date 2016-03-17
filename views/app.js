// Ionic App
angular.module('myApp', [
  'ionic',
  'firebase',
  'myApp.env',
  'myApp.authService',
  'myApp.routingService',
  'myApp.facebookService',
  'myApp.currentUserServices',
  'myApp.usersServices',
  'myApp.postService',
  'myApp.cameraServices',
  'myApp.awsServices',
  'myApp.voteService',
  'myApp.filters',
  'myApp.acountTab',
  'myApp.addTab',
  'myApp.preferences',
  'myApp.splash',
  'myApp.dashTab',
  'myApp.friends',
  'myApp.services',
  'myApp.userPage',
  'myApp.postPage'
])

// .constant('FirebaseUrl', 'https://ionic-fboauth.firebaseio.com/')
.service('rootRef', ['FirebaseUrl', Firebase])
.config(['$compileProvider', '$ionicConfigProvider', function($compileProvider, $ionicConfigProvider){
  // Modify global animation ios/android/none
  // $ionicConfigProvider.views.transition('android')
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
}])
.run(['$ionicPlatform', '$window', 'FBAppId', 'userAuth', '$rootScope', '$state', '$ionicScrollDelegate', function($ionicPlatform, $window, FBAppId, userAuth, $rootScope, $state, $ionicScrollDelegate) { 
  $ionicPlatform.ready(function() {
    console.log("App launch Device Ready");
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      // cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // Redirect the user if authenticate
    if (userAuth.isAuth()){ 
      //$state.go("tab.dash"); 
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

  // // Scroll Auto top
  // $rootScope.$on("$stateChangeSuccess", function(){
  //   $ionicScrollDelegate.scrollTop();
  // });

  // Facebook Init
  FB.init({ 
    appId: FBAppId,
    status: true, 
    cookie: true, 
    xfbml: true,
    version: 'v2.5'
  });
}]);
