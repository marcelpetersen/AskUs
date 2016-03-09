// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('myApp', [
  'ionic',
  'firebase',
  'myApp.acountTab',
  'myApp.chatsTab',
  'myApp.chat',
  'myApp.dashTab',
  'myApp.friends',
  'myApp.login',
  'myApp.services',
  'myApp.env'
])


.constant('FirebaseUrl', 'https://ionic-fboauth.firebaseio.com/')
.service('rootRef', ['FirebaseUrl', Firebase])
.run(function($ionicPlatform, $window, FBAppId) { 
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
  });

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
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('tab.login', {
      url: '/login',
      views:{
        'tab-login' : {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl as ctrl'
        }
      }
    })

    .state('tab.friends', {
      cache: false,
      url: '/friends',
      views:{
        'tab-friends' : {
          templateUrl: 'templates/friends.html',
          controller: 'friendsCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
