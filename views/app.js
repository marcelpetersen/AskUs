// Ionic App
angular.module('AskUs', [
  'ionic',
  'firebase',
  'AskUs.env',
  // Services - Factories
  'AskUs.authService',
  'AskUs.routingService',
  'AskUs.facebookService',
  'AskUs.currentUserServices',
  'AskUs.usersServices',
  'AskUs.postService',
  'AskUs.cameraServices',
  'AskUs.awsServices',
  'AskUs.voteService',
  'AskUs.categoriesService',
  'AskUs.commentsService',
  'AskUs.searchService',
  'AskUs.announcementService',
  // Directives
  'AskUs.directive',
  // Controllers and views
  'AskUs.howToUsePage',
  'AskUs.mainController',
  'AskUs.filters',
  'AskUs.acountTab',
  'AskUs.addTab',
  'AskUs.preferences',
  'AskUs.splash',
  'AskUs.dashTab',
  'AskUs.dashFilterTab',
  'AskUs.friends',
  'AskUs.services',
  'AskUs.userPage',
  'AskUs.postPage',
  'AskUs.myVotes',
  'AskUs.support',
  'AskUs.terms',
  'AskUs.legals'
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
.run(['$ionicPlatform', '$window', 'FBAppId', 'GoogleAnalyticsId', 'userAuth', '$rootScope', '$state', '$ionicScrollDelegate', '$ionicNavBarDelegate', 'Announcement', function($ionicPlatform, $window, FBAppId, GoogleAnalyticsId, userAuth, $rootScope, $state, $ionicScrollDelegate, $ionicNavBarDelegate, Announcement) { 

  $ionicPlatform.ready(function() {
    console.log("App launch Device Ready");

    // Check special announcement
    Announcement.getSpecialAnnouncement().then(function(announcement) {
      if (announcement.enable) {
        $rootScope.announcement = announcement;
        $rootScope.$emit('announcementModal');
      }
    }, function(error) {});

    // Set Google Analytics tracking
    if (window.cordova) {
      window.analytics.startTrackerWithId(GoogleAnalyticsId);
      window.analytics.setUserId(device.uuid);
      window.analytics.trackView($state.current.url); 
    }

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard, for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
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
      $state.go("splash");
      event.preventDefault(); 
    }
  });

  //stateChange success event
  $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
    //Update Google Analytics tracking
    if (window.cordova) {
      var view;
      if (toParams.postId) {
        view = "/post/" + toParams.postId;
      } else if (toParams.userId) {
        view = "/user/" + toParams.userId;
      } else if (toParams.filter) {
        view = "/filter/" + toParams.filter;
      } else {
        view = toState.url;
      }
      window.analytics.trackView(view); 
    }

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
