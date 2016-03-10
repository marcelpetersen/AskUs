angular.module('myApp.routingService', [])

.config(function($stateProvider, $urlRouterProvider) {

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

  // .state('tab.chats', {
  //     authRequired: true,
  //     url: '/chats',
  //     views: {
  //       'tab-chats': {
  //         templateUrl: 'templates/tab-chats.html',
  //         controller: 'ChatsCtrl',
  //       }
  //     }
  //   })
  //   .state('tab.chat-detail', {
  //     authRequired: true,
  //     url: '/chats/:chatId',
  //     views: {
  //       'tab-chats': {
  //         templateUrl: 'templates/chat-detail.html',
  //         controller: 'ChatDetailCtrl'
  //       }
  //     }
  //   })

    // .state('tab.login', {
    //   authRequired: true,
    //   url: '/login',
    //   views:{
    //     'tab-login' : {
    //       templateUrl: 'templates/login.html',
    //       controller: 'LoginCtrl as ctrl'
    //     }
    //   }
    // })

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


  .state('tab.user-page', {
    cache: true,
      authRequired: true,
      url: '/friends/:userName',
      views: {
        'tab-friends': {
          templateUrl: 'templates/user-page.html',
          controller: 'userPageCtrl'
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
  })

    .state('tab.preferences', {
    authRequired: true,
    url: '/preferences',
    views: {
      'tab-account': {
        templateUrl: 'templates/preferences.html',
        controller: 'preferencesCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
