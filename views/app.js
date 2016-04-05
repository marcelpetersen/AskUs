// Ionic App
angular.module('myApp', [
  'ionic',
  'firebase',
  'myApp.env',
  // Services - Factories
  'myApp.authService',
  'myApp.routingService',
  'myApp.facebookService',
  'myApp.currentUserServices',
  'myApp.usersServices',
  'myApp.postService',
  'myApp.cameraServices',
  'myApp.awsServices',
  'myApp.voteService',
  'myApp.categoriesService',
  'myApp.commentsService',
  'myApp.searchService',
  // Controllers and views
  'myApp.howToUsePage',
  'myApp.mainController',
  'myApp.filters',
  'myApp.acountTab',
  'myApp.addTab',
  'myApp.preferences',
  'myApp.splash',
  'myApp.dashTab',
  'myApp.dashFilterTab',
  'myApp.friends',
  'myApp.services',
  'myApp.userPage',
  'myApp.postPage',
  'myApp.myVotes'
])

// .constant('FirebaseUrl', 'https://ionic-fboauth.firebaseio.com/')
.service('rootRef', ['FirebaseUrl', Firebase])
.config(['$compileProvider', '$ionicConfigProvider', function($compileProvider, $ionicConfigProvider){
  // Modify global animation ios/android/none
  // $ionicConfigProvider.views.transition('android')
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  // Tabs position IOS and Android
  $ionicConfigProvider.tabs.position('bottom');
}])
.run(['$ionicPlatform', '$window', 'FBAppId', 'userAuth', '$rootScope', '$state', '$ionicScrollDelegate', '$ionicNavBarDelegate', function($ionicPlatform, $window, FBAppId, userAuth, $rootScope, $state, $ionicScrollDelegate, $ionicNavBarDelegate) { 
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
      // StatusBar.styleDefault();
      $cordovaStatusbar.overlaysWebView(true)
      $cordovaStatusBar.style(1) //Light
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

      //$window.location.reload();
      //$window.location.href = '#/splash';  

      event.preventDefault(); 
    }
  });

  //stateChange success event
  $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
    console.log(fromState, toState);
    if (fromState.hideBackButton && !toState.hideBackButton) {
        // Enable back history button
        $ionicNavBarDelegate.showBackButton(true);
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
}]);
