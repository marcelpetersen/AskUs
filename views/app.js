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
  'myApp.authService'
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

        //stateChange event
      $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      if (toState.authRequired && !userAuth.isAuth()){ //Assuming the AuthService holds authentication logic
        // User isn’t authenticated
        console.log('Please Login');
        $state.go("splash");
        event.preventDefault(); 
      }
    });
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

  // Splash Screen & Login
  .state('splash', {
    authRequired: false,
    templateUrl: 'templates/splash.html',
    url: '/splash',
    controller: 'splashCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    authRequired: true,
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      authRequired: true,
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl',
        }
      }
    })
    .state('tab.chat-detail', {
      authRequired: true,
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('tab.login', {
      authRequired: true,
      url: '/login',
      views:{
        'tab-login' : {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl as ctrl'
        }
      }
    })

    .state('tab.friends', {
      authRequired: true,
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
    authRequired: true,
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
